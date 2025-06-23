<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">📚 Letölthető dokumentumok</h1>

    <div v-if="documents.length === 0">
      <p class="text-gray-600">Nincs elérhető dokumentum.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div
        v-for="doc in documents"
        :key="doc.file"
        class="border rounded p-4 shadow hover:shadow-lg transition"
      >
        <h2 class="text-xl font-semibold mb-2">{{ doc.name }}</h2>
        <p class="text-sm text-gray-500 mb-4">PDF fájl</p>

        <button
          :disabled="!authUser"
          @click="handleDownload(doc.file)"
          class="px-4 py-2 rounded text-sm transition duration-200"
          :class="authUser
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          {{ authUser ? 'Letöltés' : 'Jelentkezz be a letöltéshez' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const documents = ref([])
const authUser = useCookie('auth_user')

const handleDownload = (file) => {
  if (!authUser.value) return
  navigateTo(`/letoltes?file=${encodeURIComponent(file)}`)
}

onMounted(async () => {
  try {
    const res = await fetch('/api/documents')
    documents.value = await res.json()
  } catch (err) {
    console.error('❌ Nem sikerült lekérni a dokumentumokat:', err)
  }
})
</script>
