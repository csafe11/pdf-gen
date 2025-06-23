// server/api/register.ts
import { defineEventHandler, readBody, setCookie, setResponseStatus } from "h3";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const usersFilePath = path.resolve("data/users.json");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  if (!name || !email || !password) {
    setResponseStatus(event, 400);
    return { error: "Minden mező kötelező." };
  }

  let users: any[] = [];
  try {
    const file = await readFile(usersFilePath, "utf-8");
    users = JSON.parse(file);
  } catch {}

  const exists = users.find((u) => u.email === email);
  if (exists) {
    setResponseStatus(event, 409);
    return { error: "Ez az email már regisztrálva van." };
  }

  users.push({ name, email, password });
  await writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");

  // ✅ automatikus bejelentkezés: cookie beállítás
  setCookie(event, "auth_user", email, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  setCookie(event, "user_session", "true", {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
});
