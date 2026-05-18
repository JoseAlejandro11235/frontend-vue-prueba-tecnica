<template>
  <div class="container">
    <h1>Productos</h1>
    <router-link :to="{ name: 'products-new' }">Nuevo producto</router-link>

    <div class="card">
      <input v-model="q" placeholder="Buscar producto" />
      <select v-model="categoryId">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button type="button" @click="loadProducts">Buscar</button>
    </div>

    <p v-if="loading">Cargando productos...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.category?.name ?? '-' }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <td>
            <router-link :to="{ name: 'products-edit', params: { id: p.id } }">Editar</router-link>
            <router-link :to="{ name: 'products-stock', params: { id: p.id } }">Stock</router-link>
            <button type="button" @click="remove(p.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/client'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const q = ref('')
const categoryId = ref('')

async function loadCategories() {
  const { data } = await api.get('/categories')
  categories.value = data.categories
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/products', {
      params: { q: q.value, category_id: categoryId.value },
    })
    products.value = data
  } catch (err) {
    error.value = err.response ? `Error: ${err.response.status}` : 'Error de red'
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (!confirm('¿Eliminar producto?')) return
  try {
    await api.delete(`/products/${id}`)
    success.value = 'Producto eliminado'
    await loadProducts()
  } catch {
    error.value = 'No se pudo eliminar'
  }
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>
