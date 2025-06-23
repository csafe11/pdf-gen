// plugins/init-auth.client.ts
export default defineNuxtPlugin(() => {
  const state = useState("authUser", () => null);
  const authCookie = useCookie("auth_user"); // Ez HttpOnly, tehát itt undefined lesz!

  if (process.client) {
    // Nem fogod látni itt a cookiet, mert HttpOnly
    // Használj API-t vagy middleware-t szerver oldalon
    console.warn("Ez a plugin nem tudja olvasni a HttpOnly sütit.");
  }
});
