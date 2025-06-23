<template>
  <div>
    <h1>Nuxt Webshop</h1>
    <p>{{ message }}</p>
    <ul>
      <li v-for="product in products" :key="product.id">{{ product.name }}</li>
    </ul>
  </div>
</template>

<script setup>
const { data: message } = await useFetch('/api')
const { data: products } = await useFetch('/api/products')
</script>
