// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useState("authUser");
  if (!user.value) {
    return navigateTo("/belepes");
  }
});
