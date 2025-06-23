import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Teszt PDF", {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0.2, 0.2, 0.7),
    });

    const pdfBytes = await pdfDoc.save();

    setResponseHeader(event, "Content-Type", "application/pdf");
    setResponseHeader(
      event,
      "Content-Disposition",
      "attachment; filename=teszt.pdf"
    );

    return pdfBytes;
  } catch (err) {
    console.error("Hiba a PDF generálás során:", err);
    return { error: "Hiba a PDF készítéskor" };
  }
});
