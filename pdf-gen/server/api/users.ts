// server/api/user.ts
export default defineEventHandler((event) => {
  const email = getCookie(event, "auth_user");
  return { email: email || null };
});
