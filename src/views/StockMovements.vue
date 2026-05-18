<template>
  <div>
    <PageHeader title="Movimientos de stock" subtitle="Entradas y salidas de inventario" eyebrow="Producto">
      <template #actions>
        <router-link :to="{ name: 'products' }" class="btn-secondary">← Productos</router-link>
      </template>
    </PageHeader>

    <AlertBanner :message="error" variant="error" dismissible @dismiss="error = ''" />
    <AlertBanner :message="success" variant="success" dismissible @dismiss="success = ''" />

    <div class="glass-card mb-6 p-6">
      <h2 class="mb-4 text-sm font-semibold text-white">Registrar movimiento</h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Tipo</label>
          <select v-model="form.type" class="input-field">
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Cantidad</label>
          <input v-model="form.quantity" type="number" min="1" class="input-field" placeholder="0" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-slate-400">Motivo</label>
          <input v-model="form.reason" class="input-field" placeholder="Opcional" />
        </div>
      </div>
      <button type="button" class="btn-primary mt-4" @click="save">Registrar</button>
    </div>

    <div class="glass-card overflow-hidden">
      <div class="border-b border-white/10 px-6 py-4">
        <h2 class="text-sm font-semibold text-white">Historial</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
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
              <td class="font-mono text-slate-500">#{{ m.id }}</td>
              <td>
                <span :class="m.type === 'entrada' ? 'badge badge-in' : 'badge badge-out'">
                  {{ m.type }}
                </span>
              </td>
              <td class="font-mono">{{ m.quantity }}</td>
              <td class="text-slate-400">{{ m.reason || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/client'
import { unwrapPaginated } from '@/api/response'
import AlertBanner from '@/components/AlertBanner.vue'
import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()
const movements = ref([])
const form = reactive({ type: 'entrada', quantity: '', reason: '' })
const error = ref('')
const success = ref('')

async function load() {
  const response = await api.get(`/products/${route.params.id}/stock-movements`)
  movements.value = unwrapPaginated(response).items
}

async function save() {
  try {
    await api.post(`/products/${route.params.id}/stock-movements`, form)
    success.value = 'Movimiento registrado'
    form.quantity = ''
    form.reason = ''
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar'
  }
}

onMounted(load)
</script>
