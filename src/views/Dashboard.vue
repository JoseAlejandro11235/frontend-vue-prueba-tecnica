<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="loading">Cargando...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div class="card">
      <h3>Productos: {{ data.products }}</h3>
      <h3>Categorías: {{ data.categories }}</h3>
      <h3>Bajo stock: {{ data.low_stock?.length ?? 0 }}</h3>
    </div>

    <div class="card">
      <h3>Últimos movimientos</h3>
      <ul>
        <li v-for="m in data.last_movements" :key="m.id">
          {{ m.type }} - {{ m.quantity }} - {{ m.reason }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/client'

const loading = ref(false)
const error = ref('')
const data = ref({})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const { data: payload } = await api.get('/dashboard')
    data.value = payload
  } catch {
    error.value = 'No se pudo cargar dashboard'
  } finally {
    loading.value = false
  }
})
</script>
