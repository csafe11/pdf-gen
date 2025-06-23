<script setup>
const auth = useState('authUser')

const logout = async () => {
  await fetch('/api/logout', { method: 'POST' })
  useCookie('auth_user').value = null
  useState('authUser').value = null
  await navigateTo('/')
}
</script>

<template>
  <header class="p-4 flex justify-between items-center shadow">
    <NuxtLink to="/" class="font-bold text-xl">PDF Letöltő</NuxtLink>

    <div class="flex gap-4">
      <NuxtLink to="/letoltes" class="text-blue-600 underline">Letöltés</NuxtLink>

      <template v-if="auth">
        <button @click="logout" class="text-red-600 underline">Kijelentkezés</button>
      </template>
      <template v-else>
        <NuxtLink to="/belepes" class="text-blue-600 underline">Belépés</NuxtLink>
        <NuxtLink to="/regisztracio" class="text-green-600 underline">Regisztráció</NuxtLink>
      </template>
    </div>
  </header>
</template>
