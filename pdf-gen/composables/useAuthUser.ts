export const useAuthUser = () => {
  return useState("authUser", () => {
    const nuxtApp = useNuxtApp();
    // Szerveroldalon a context-ből (pluginből) olvasunk
    if (process.server) {
      return nuxtApp.ssrContext?.event?.context?.authUser || null;
    }

    // Client oldalon sütiből (opcionális fallback)
    const cookie = useCookie("auth_user");
    return cookie.value || null;
  });
};
