<template>
  <div>
    <PageHeader
      title="Dashboard"
      subtitle="Resumen del inventario en tiempo real"
      eyebrow="Panel"
    />

    <AlertBanner :message="error" variant="error" />

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <div class="mb-8 grid gap-4 sm:grid-cols-3">
        <div class="glass-card p-6">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Productos</p>
          <p class="mt-2 text-4xl font-bold text-white">{{ data.products ?? 0 }}</p>
        </div>
        <div class="glass-card p-6">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">CategorÃ­as</p>
          <p class="mt-2 text-4xl font-bold text-white">{{ data.categories ?? 0 }}</p>
        </div>
        <div class="glass-card border-amber-500/20 p-6">
          <p class="text-xs font-medium uppercase tracking-wider text-amber-400/80">Bajo stock</p>
          <p class="mt-2 text-4xl font-bold text-amber-300">{{ data.low_stock?.length ?? 0 }}</p>
        </div>
      </div>

      <div class="glass-card overflow-hidden">
        <div class="border-b border-white/10 px-6 py-4">
          <h2 class="text-lg font-semibold text-white">Ãšltimos movimientos</h2>
        </div>
        <div v-if="!data.last_movements?.length" class="px-6 py-10 text-center text-sm text-slate-500">
          Sin movimientos recientes
        </div>
        <div v-else class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in data.last_movements" :key="m.id">
                <td>
                  <span :class="m.type === 'entrada' ? 'badge badge-in' : 'badge badge-out'">
                    {{ m.type }}
                  </span>
                </td>
                <td class="font-mono">{{ m.quantity }}</td>
                <td class="text-slate-400">{{ m.reason || 'â€”' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/client'
import { unwrapData } from '@/api/response'
import AlertBanner from '@/components/AlertBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PageHeader from '@/components/PageHeader.vue'

const loading = ref(false)
const error = ref('')
const data = ref({})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/dashboard')
    data.value = unwrapData(response) ?? {}
  } catch {
    error.value = 'No se pudo cargar el dashboard'
  } finally {
    loading.value = false
  }
})
</script>
