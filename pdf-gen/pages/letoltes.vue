<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">📥 Dokumentumok letöltése</h1>

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
          @click="download(doc.file)"
          class="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          Letöltés
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth',
})

const documents = ref([])

const download = async (fileName) => {
  try {
    const url = `/${fileName}`
    const res = await fetch(url)

    if (!res.ok) throw new Error('Nem található a fájl.')

    const blob = await res.blob()
    const dlUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = dlUrl
    a.download = fileName
    a.click()
    URL.revokeObjectURL(dlUrl)
  } catch (err) {
    console.error('❌ Nem sikerült letölteni a fájlt:', err)
  }
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
