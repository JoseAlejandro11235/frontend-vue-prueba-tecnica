<template>
  <div class="container">
    <h1>Categorías</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <div class="card">
      <input v-model="form.name" placeholder="Nombre categoría" />
      <input v-model="form.description" placeholder="Descripción" />
      <button type="button" @click="save">Guardar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.status }}</td>
          <td>
            <button type="button" @click="edit(c)">Editar</button>
            <button type="button" @click="remove(c.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/api/client'

const categories = ref([])
const form = reactive({ id: null, name: '', description: '', status: 1 })
const error = ref('')
const success = ref('')

async function load() {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.categories
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
    success.value = 'Guardado'
    resetForm()
    await load()
  } catch (err) {
    error.value = err.response ? JSON.stringify(err.response.data) : 'Error'
  }
}

async function remove(id) {
  await api.delete(`/categories/${id}`)
  await load()
}

onMounted(load)
</script>
