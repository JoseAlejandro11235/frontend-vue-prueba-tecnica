<template>
  <div class="container">
    <h1>Movimientos de Stock</h1>
    <router-link :to="{ name: 'products' }">Volver</router-link>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <div class="card">
      <select v-model="form.type">
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>
      <input v-model="form.quantity" placeholder="Cantidad" />
      <input v-model="form.reason" placeholder="Motivo" />
      <button type="button" @click="save">Registrar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in movements" :key="m.id">
          <td>{{ m.id }}</td>
          <td>{{ m.type }}</td>
          <td>{{ m.quantity }}</td>
          <td>{{ m.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/client'

const route = useRoute()
const movements = ref([])
const form = reactive({ type: 'entrada', quantity: '', reason: '' })
const error = ref('')
const success = ref('')

async function load() {
  const { data } = await api.get(`/products/${route.params.id}/stock-movements`)
  movements.value = data
}

async function save() {
  try {
    await api.post(`/products/${route.params.id}/stock-movements`, form)
    success.value = 'Movimiento registrado'
    await load()
  } catch (err) {
    error.value = err.response ? JSON.stringify(err.response.data) : 'Error de red'
  }
}

onMounted(load)
</script>
