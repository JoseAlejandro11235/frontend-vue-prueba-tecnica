<template>
  <div>
    <PageHeader title="Productos" subtitle="Catálogo y niveles de stock" eyebrow="Inventario">
      <template #actions>
        <router-link :to="{ name: 'products-new' }" class="btn-primary">+ Nuevo producto</router-link>
      </template>
    </PageHeader>

    <div class="glass-card mb-6 p-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Buscar</label>
          <input v-model="q" type="search" class="input-field" placeholder="Nombre del producto…" @keyup.enter="loadProducts" />
        </div>
        <div class="sm:w-56">
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Categoría</label>
          <select v-model="categoryId" class="input-field">
            <option value="">Todas</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <button type="button" class="btn-primary shrink-0" @click="loadProducts">Buscar</button>
      </div>
    </div>

    <AlertBanner :message="error" variant="error" dismissible @dismiss="error = ''" />
    <AlertBanner :message="success" variant="success" dismissible @dismiss="success = ''" />

    <LoadingSpinner v-if="loading" label="Cargando productos…" />

    <div v-else class="glass-card overflow-hidden">
      <div v-if="!products.length" class="px-6 py-16 text-center text-slate-500">
        No hay productos. Crea uno o ajusta los filtros.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td class="font-mono text-slate-500">#{{ p.id }}</td>
              <td class="font-medium text-white">{{ p.name }}</td>
              <td>{{ p.category?.name ?? '—' }}</td>
              <td class="font-mono text-emerald-300">${{ Number(p.price).toFixed(2) }}</td>
              <td>
                <span :class="p.stock < 10 ? 'badge badge-warning' : 'badge badge-success'">
                  {{ p.stock }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex justify-end gap-1">
                  <router-link :to="{ name: 'products-edit', params: { id: p.id } }" class="btn-ghost">Editar</router-link>
                  <router-link :to="{ name: 'products-stock', params: { id: p.id } }" class="btn-ghost">Stock</router-link>
                  <button type="button" class="btn-danger" @click="remove(p.id)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/client'
import { unwrapPaginated } from '@/api/response'
import AlertBanner from '@/components/AlertBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PageHeader from '@/components/PageHeader.vue'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const q = ref('')
const categoryId = ref('')

async function loadCategories() {
  const response = await api.get('/categories')
  categories.value = unwrapPaginated(response).items
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/products', {
      params: { q: q.value, category_id: categoryId.value },
    })
    products.value = unwrapPaginated(response).items
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
