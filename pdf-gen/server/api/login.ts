export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // egyszerű ellenőrzés
  if (email && password) {
    setCookie(event, "auth_user", email, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 nap
    });
    return { success: true };
  }

  return { success: false, error: "Hibás adatok" };
});
