// // plugins/init-auth.client.ts
// export default defineNuxtPlugin(() => {
//   const authUser = useCookie("auth_user");
//   const state = useState("authUser", () => null);

//   if (authUser.value) {
//     state.value = { email: authUser.value };
//   } else {
//     state.value = null;
//   }
// });
