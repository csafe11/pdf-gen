// a fájl tetején:
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from 'fontkit' // vagy: const fontkit = require('fontkit')
import { readFile, writeFile } from "fs/promises";
import {
  defineEventHandler,
  getQuery,
  setResponseHeader,
  setResponseStatus,
} from "h3";
import path from "path";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orderId = query.orderId as string;

  if (!orderId) {
    setResponseStatus(event, 400);
    return { error: "Hiányzó rendelési azonosító." };
  }

  const order = {
    orderId,
    customerName: "Kovács Bőla",
    customerAddress: "1234 Budapest, Fő utca 12.",
    date: new Date().toISOString().split("T")[0],
    items: [
      { name: "Vegán pizzaszett", quantity: 2, price: 3990 },
      { name: "Mandulatej 1L", quantity: 3, price: 890 },
      { name: "Gluténmentes kenyér", quantity: 1, price: 1290 },
      { name: "Zabkeksz 200g", quantity: 5, price: 590 },
    ],
  };

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit); // ✅ 2. regisztráld
    const page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();

    // ✅ Unicode-kompatibilis betűtípus beágyazása (Roboto)
    const fontPath = path.resolve("assets/fonts/Roboto-Regular.ttf");
    const fontBytes = await readFile(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    // 🔧 Logó beágyazás (ha van)
    try {
      const logoPath = path.resolve("public/logo.png");
      const logoBytes = await readFile(logoPath);
      const pngImage = await pdfDoc.embedPng(logoBytes);
      const pngDims = pngImage.scale(0.25);
      page.drawImage(pngImage, {
        x: 50,
        y: height - 80,
        width: pngDims.width,
        height: pngDims.height,
      });
    } catch (e) {
      console.warn("⚠️ Logó betöltése sikertelen (nem kötelező):", e);
    }

    // 🧾 Mezők
    let y = height - 130;
    page.drawText(`Számlaszám: ${order.orderId}`, { x: 50, y, size: 12, font });
    page.drawText(`Dátum: ${order.date}`, {
      x: 50,
      y: (y -= 15),
      size: 12,
      font,
    });
    page.drawText(`Megrendelő: ${order.customerName}`, {
      x: 50,
      y: (y -= 25),
      size: 12,
      font,
    });
    page.drawText(`Cím: ${order.customerAddress}`, {
      x: 50,
      y: (y -= 15),
      size: 12,
      font,
    });

    // 📋 Táblázat
    y -= 30;
    page.drawText("Tétel", { x: 50, y, size: 12, font });
    page.drawText("Menny.", { x: 300, y, size: 12, font });
    page.drawText("Egységár", { x: 370, y, size: 12, font });
    page.drawText("Összeg", { x: 470, y, size: 12, font });

    let total = 0;
    for (const item of order.items) {
      y -= 18;
      const sum = item.quantity * item.price;
      total += sum;
      page.drawText(item.name, { x: 50, y, size: 12, font });
      page.drawText(`${item.quantity} db`, { x: 300, y, size: 12, font });
      page.drawText(`${item.price} Ft`, { x: 370, y, size: 12, font });
      page.drawText(`${sum} Ft`, { x: 470, y, size: 12, font });
    }

    // 💰 Végösszeg
    y -= 30;
    page.drawText(`Végösszeg: ${total} Ft`, {
      x: 370,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0.7),
    });

    // 📂 PDF mentése fájlba
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.resolve(`orders/${orderId}.pdf`);
    await writeFile(outputPath, pdfBytes);

    // 📤 PDF visszaküldése
    setResponseHeader(event, "Content-Type", "application/pdf");
    setResponseHeader(
      event,
      "Content-Disposition",
      `attachment; filename=${orderId}.pdf`
    );
    return pdfBytes;
  } catch (err) {
    console.error("❌ Hiba a PDF generálás közben:", err);
    setResponseStatus(event, 500);
    return { error: "Hiba a PDF létrehozásakor." };
  }
});
