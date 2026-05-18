<template>
  <div class="container">
    <h1>{{ isEdit ? 'Editar' : 'Crear' }} Producto</h1>
    <p v-if="loading">Guardando...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <div class="card">
      <input v-model="form.name" placeholder="Nombre" />
      <textarea v-model="form.description" placeholder="Descripción" />
      <input v-model="form.price" placeholder="Precio" />
      <input v-model="form.stock" placeholder="Stock" />
      <select v-model="form.category_id">
        <option value="">Seleccione categoría</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <select v-model="form.status">
        <option :value="1">Activo</option>
        <option :value="0">Inactivo</option>
      </select>
      <button type="button" @click="save">Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/client'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref('')
const categories = ref([])
const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  status: 1,
})

const isEdit = computed(() => Boolean(route.params.id))

async function loadCategories() {
  const { data } = await api.get('/categories')
  categories.value = data.categories
}

async function loadProduct() {
  const { data } = await api.get(`/products/${route.params.id}`)
  Object.assign(form, data.data)
}

async function save() {
  if (!form.name) {
    error.value = 'Nombre requerido'
    return
  }

  loading.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await api.put(`/products/${route.params.id}`, form)
    } else {
      await api.post('/products', form)
    }
    success.value = 'Guardado correctamente'
    setTimeout(() => router.push({ name: 'products' }), 800)
  } catch (err) {
    error.value = err.response ? JSON.stringify(err.response.data) : 'Error de red'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  if (isEdit.value) {
    await loadProduct()
  }
})
</script>
