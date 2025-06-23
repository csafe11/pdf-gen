<template>
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Regisztráció</h1>
  
      <form @submit.prevent="submitForm" class="space-y-4">
        <input
          v-model="name"
          placeholder="Név"
          class="w-full border rounded p-2"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded p-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Jelszó"
          class="w-full border rounded p-2"
        />
  
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Regisztrálok
        </button>
  
        <p v-if="error" class="text-red-600">{{ error }}</p>
        <p v-if="success" class="text-green-600">Sikeres regisztráció! Átirányítás...</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const success = ref(false)
  const router = useRouter()
  
  const submitForm = async () => {
    error.value = ''
    success.value = false
  
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
      })
  
      if (!res.ok) {
        const data = await res.json()
        error.value = data.error || 'Ismeretlen hiba történt.'
        return
      }
  
      success.value = true
  
      setTimeout(() => {
        router.push('/belepes')
      }, 1500)
    } catch (err) {
      error.value = 'Hálózati hiba.'
      console.error(err)
    }
  }
  </script>
  