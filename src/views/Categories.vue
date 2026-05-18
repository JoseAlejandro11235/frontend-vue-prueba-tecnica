<template>
  <div>
    <PageHeader title="Categorías" subtitle="Organiza tu catálogo de productos" eyebrow="Catálogo" />

    <AlertBanner :message="error" variant="error" dismissible @dismiss="error = ''" />
    <AlertBanner :message="success" variant="success" dismissible @dismiss="success = ''" />

    <div class="glass-card mb-6 p-6">
      <h2 class="mb-4 text-sm font-semibold text-white">{{ form.id ? 'Editar categoría' : 'Nueva categoría' }}</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Nombre *</label>
          <input v-model="form.name" class="input-field" placeholder="Nombre" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Descripción</label>
          <input v-model="form.description" class="input-field" placeholder="Descripción opcional" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button type="button" class="btn-primary" @click="save">Guardar</button>
        <button v-if="form.id" type="button" class="btn-secondary" @click="resetForm">Cancelar</button>
      </div>
    </div>

    <div class="glass-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td class="font-mono text-slate-500">#{{ c.id }}</td>
              <td class="font-medium text-white">{{ c.name }}</td>
              <td>
                <span :class="c.status ? 'badge badge-success' : 'badge badge-warning'">
                  {{ c.status ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-right">
                <button type="button" class="btn-ghost" @click="edit(c)">Editar</button>
                <button type="button" class="btn-danger" @click="remove(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/api/client'
import { unwrapPaginated } from '@/api/response'
import AlertBanner from '@/components/AlertBanner.vue'
import PageHeader from '@/components/PageHeader.vue'

const categories = ref([])
const form = reactive({ id: null, name: '', description: '', status: 1 })
const error = ref('')
const success = ref('')

async function load() {
  try {
    const response = await api.get('/categories')
    categories.value = unwrapPaginated(response).items
  } catch {
    error.value = 'Error al cargar categorías'
  }
}

function edit(category) {
  Object.assign(form, category)
}

function resetForm() {
  form.id = null
  form.name = ''
  form.description = ''
  form.status = 1
}

async function save() {
  if (!form.name) {
    error.value = 'Nombre obligatorio'
    return
  }
  try {
    if (form.id) {
      await api.put(`/categories/${form.id}`, form)
    } else {
      await api.post('/categories', form)
    }
    success.value = 'Guardado correctamente'
    resetForm()
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar'
  }
}

async function remove(id) {
  if (!confirm('¿Eliminar categoría?')) return
  await api.delete(`/categories/${id}`)
  await load()
}

onMounted(load)
</script>
