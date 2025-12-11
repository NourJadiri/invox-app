"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createLesson, CreateLessonInput, updateLesson, UpdateLessonInput, deleteLesson, syncLessonsToGoogleCalendar } from "@/services";
import { validateGoogleToken } from "@/lib/google-calendar";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const createLessonAction = async (data: CreateLessonInput) => {
    try {

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        await createLesson(data, userId);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to create lesson. Please try again later."
        };
    }
}

export const updateLessonAction = async (id: string, data: UpdateLessonInput) => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        await updateLesson(id, data, userId);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to update lesson. Please try again later."
        };
    }
}

export const deleteLessonAction = async (id: string) => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        await deleteLesson(id, userId);

        revalidatePath("/schedule");

        return { success: true };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to delete lesson. Please try again later."
        };
    }
}

export const syncToGoogleCalendarAction = async () => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                error: "You must be signed in with Google to sync your calendar."
            };
        }

        const result = await syncLessonsToGoogleCalendar(userId);

        revalidatePath("/schedule");

        return { 
            success: true, 
            synced: result.synced,
            failed: result.failed
        };
    }    
    catch (error) {
        console.error("Server Action Error:", error);
        return { 
            success: false, 
            error: "Failed to sync with Google Calendar. Please try again later."
        };
    }
}

/**
 * Server action to check if the user's Google OAuth token is valid.
 * Used to determine if the user needs to reconnect their Google account.
 */
export const checkGoogleTokenAction = async () => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return {
                valid: false,
                error: "Not signed in"
            };
        }

        const result = await validateGoogleToken(userId);
        return result;
    } catch (error) {
        console.error("Server Action Error:", error);
        return { 
            valid: false, 
            error: "Failed to validate Google token."
        };
    }
}

