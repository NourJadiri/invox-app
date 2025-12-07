import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildInvoiceHtml } from "@/features/invoice/server/build-invoice-html";
import type { InvoiceConfig } from "@/features/invoice/types";

export const runtime = "nodejs"; // Required because Puppeteer needs full Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvoiceConfig;

    const html = buildInvoiceHtml(body);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
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
