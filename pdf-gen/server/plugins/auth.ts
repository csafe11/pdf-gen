// server/plugins/auth.ts
import { getCookie } from "h3";

export default defineEventHandler((event) => {
  const authCookie = getCookie(event, "auth_user");

  if (authCookie) {
    event.context.authUser = { email: authCookie };
  }
});
