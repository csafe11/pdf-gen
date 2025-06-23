import { defineEventHandler } from "h3";
import { readdir } from "fs/promises";
import path from "path";

export default defineEventHandler(async () => {
  const dirPath = path.resolve("public");
  const files = await readdir(dirPath);

  // Csak PDF fájlokat adunk vissza
  return files
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => ({
      name: file.replace(".pdf", "").replace(/[-_]/g, " "),
      file,
    }));
});
