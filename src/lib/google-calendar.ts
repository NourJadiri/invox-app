import { google, calendar_v3 } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function getGoogleCalendarClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account) {
    throw new Error("No Google account linked");
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    // NextAuth stores expires_at in seconds, Google expects expiry_date in milliseconds
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  });

  // Handle token refresh if needed (googleapis does this automatically if refresh_token is present)
  // However, we might want to listen to the 'tokens' event to update our DB if the token changes
  auth.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: account.providerAccountId,
          },
        },
        data: {
          access_token: tokens.access_token,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
          refresh_token: tokens.refresh_token ?? undefined, // Only update if new one provided
        },
      });
    }
  });

  return google.calendar({ version: "v3", auth });
}

export async function insertGoogleEvent(userId: string, event: calendar_v3.Schema$Event) {
  const calendar = await getGoogleCalendarClient(userId);
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
  return response.data;
}

export async function updateGoogleEvent(userId: string, eventId: string, event: calendar_v3.Schema$Event) {
  const calendar = await getGoogleCalendarClient(userId);
  const response = await calendar.events.update({
    calendarId: "primary",
    eventId: eventId,
    requestBody: event,
  });
  return response.data;
}

export async function deleteGoogleEvent(userId: string, eventId: string) {
  const calendar = await getGoogleCalendarClient(userId);
  await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });
}

/**
 * Validates if the user's Google OAuth token is still valid.
 * Makes a lightweight API call to check token validity.
 * Returns { valid: true } if token works, { valid: false, error: string } otherwise.
 */
export async function validateGoogleToken(userId: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const account = await prisma.account.findFirst({
      where: { userId, provider: "google" },
    });

    if (!account) {
      return { valid: false, error: "No Google account linked" };
    }

    if (!account.refresh_token) {
      return { valid: false, error: "No refresh token available" };
    }

    // Try to get the calendar client and make a lightweight request
    const calendar = await getGoogleCalendarClient(userId);
    
    // Use calendarList.get which is a very lightweight call
    await calendar.calendarList.get({ calendarId: "primary" });
    
    return { valid: true };
  } catch (error) {
    // Check if it's an invalid_grant error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isInvalidGrant = errorMessage.includes("invalid_grant") || 
                           (error && typeof error === "object" && "code" in error && error.code === 400);
    
    if (isInvalidGrant) {
      return { valid: false, error: "Token expired or revoked. Please reconnect your Google account." };
    }
    
    return { valid: false, error: errorMessage };
  }
}

/**
 * Lists events from Google Calendar within a date range.
 * Optionally filters by events starting with a specific prefix in the summary.
 */
export async function listGoogleCalendarEvents(
  userId: string,
  options: {
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
    summaryPrefix?: string;
  } = {}
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = await getGoogleCalendarClient(userId);

  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
    maxResults: options.maxResults ?? 250,
  };

  if (options.timeMin) {
    params.timeMin = options.timeMin.toISOString();
  }
  if (options.timeMax) {
    params.timeMax = options.timeMax.toISOString();
  }

  const response = await calendar.events.list(params);
  let events = response.data.items ?? [];

  // Filter by summary prefix if provided
  if (options.summaryPrefix) {
    events = events.filter((event) =>
      event.summary?.startsWith(options.summaryPrefix!)
    );
  }

  return events;
}
