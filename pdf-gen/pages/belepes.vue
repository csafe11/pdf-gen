<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Bejelentkezés</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border rounded p-2"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Jelszó"
        class="w-full border rounded p-2"
        required
      />

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Belépés
      </button>

      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

const { fetchAuth } = useAuth()

const submitForm = async () => {
  error.value = ''
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const result = await res.json()
    if (!res.ok || !result.success) {
      error.value = result.error || 'Hibás email vagy jelszó.'
      return
    }

    // 🍪 Ellenőrzés, be van-e állítva a süti
    console.log('✅ Bejelentkezés sikeres, süti beállítva?')
    const cookie = useCookie('auth_user')
    console.log('auth_user cookie:', cookie.value)

    useState('authUser').value = result.user
    await fetchAuth()
    await navigateTo('/letoltes', { replace: true })
  } catch (err) {
    console.error('❌ Hálózati hiba:', err)
    error.value = 'Hálózati hiba.'
  }
}


</script>


