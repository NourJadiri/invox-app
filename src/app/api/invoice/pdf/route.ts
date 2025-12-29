import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildInvoiceHtml } from "@/features/invoice/server/build-invoice-html";
import type { InvoiceConfig } from "@/features/invoice/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvoiceConfig;

    const html = buildInvoiceHtml(body);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    await browser.close();

    const dateForFilename = new Date(body.startDate);
    const month = format(dateForFilename, "MMMM", { locale: fr });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = format(dateForFilename, "yyyy", { locale: fr });
    const filename = `Facture ${capitalizedMonth} ${year}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error("Failed to generate invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice PDF" },
      { status: 500 },
    );
  }
}
