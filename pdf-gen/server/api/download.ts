// server/api/download.ts
import { defineEventHandler, getQuery, sendError, createError, send } from "h3";
import { readFile } from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  const { file } = getQuery(event);

  if (!file || typeof file !== "string") {
    throw createError({
      statusCode: 400,
      message: "A fájlnév nem lett megadva.",
    });
  }

  const filePath = path.resolve("public", file);

  try {
    const pdfData = await readFile(filePath);
    return send(event, pdfData, "application/pdf", {
      headers: {
        "Content-Disposition": `attachment; filename=${file}`,
      },
    });
  } catch (err) {
    console.error("❌ Hiba a fájl olvasásakor:", err);
    throw createError({ statusCode: 404, message: "A fájl nem található." });
  }
});
