// composables/useAuth.ts
export const useAuth = () => {
  const authUser = useState<string | null>("authUser", () => null);

  const fetchAuth = async () => {
    try {
      const { email } = await $fetch("/api/user");
      authUser.value = email;
    } catch {
      authUser.value = null;
    }
  };

  return { authUser, fetchAuth };
};
