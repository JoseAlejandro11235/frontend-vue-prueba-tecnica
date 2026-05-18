<template>
  <div>
    <PageHeader
      :title="isEdit ? 'Editar producto' : 'Nuevo producto'"
      :subtitle="isEdit ? 'Actualiza los datos del producto' : 'Añade un producto al inventario'"
      eyebrow="Productos"
    >
      <template #actions>
        <router-link :to="{ name: 'products' }" class="btn-secondary">← Volver</router-link>
      </template>
    </PageHeader>

    <AlertBanner :message="error" variant="error" dismissible @dismiss="error = ''" />
    <AlertBanner :message="success" variant="success" />

    <div class="glass-card max-w-2xl p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre *</label>
          <input v-model="form.name" class="input-field" placeholder="Nombre del producto" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Descripción</label>
          <textarea v-model="form.description" class="input-field min-h-[100px] resize-y" placeholder="Descripción" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Precio</label>
          <input v-model="form.price" type="number" step="0.01" class="input-field" placeholder="0.00" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Stock</label>
          <input v-model="form.stock" type="number" class="input-field" placeholder="0" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Categoría</label>
          <select v-model="form.category_id" class="input-field">
            <option value="">Seleccione categoría</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Estado</label>
          <select v-model="form.status" class="input-field">
            <option :value="1">Activo</option>
            <option :value="0">Inactivo</option>
          </select>
        </div>
      </div>
      <button type="button" class="btn-primary mt-6" :disabled="loading" @click="save">
        {{ loading ? 'Guardando…' : 'Guardar producto' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/client'
import { unwrapData, unwrapPaginated } from '@/api/response'
import AlertBanner from '@/components/AlertBanner.vue'
import PageHeader from '@/components/PageHeader.vue'

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
  const response = await api.get('/categories')
  categories.value = unwrapPaginated(response).items
}

async function loadProduct() {
  const response = await api.get(`/products/${route.params.id}`)
  Object.assign(form, unwrapData(response))
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
    error.value = err.response?.data?.message || 'Error al guardar'
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
