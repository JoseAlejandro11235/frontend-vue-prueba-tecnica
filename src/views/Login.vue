<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <span class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-xl shadow-indigo-600/40">LP</span>
        <h1 class="text-2xl font-bold text-white">Bienvenido</h1>
        <p class="mt-2 text-sm text-slate-400">Gestion de inventario</p>
      </div>
      <div class="glass-card p-8">
        <AlertBanner :message="error" variant="error" dismissible @dismiss="error = ''" />
        <form class="space-y-5" @submit.prevent="submit">
          <div>
            <label class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">Email</label>
            <input v-model="email" type="email" class="input-field" placeholder="admin@legacy.test" autocomplete="email" required />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">Contrasena</label>
            <input v-model="password" type="password" class="input-field" placeholder="password" autocomplete="current-password" required />
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="loading">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
        </form>
        <p class="mt-6 text-center text-xs text-slate-500">Demo: admin@legacy.test / password</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertBanner from '@/components/AlertBanner.vue'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const email = ref('admin@legacy.test')
const password = ref('password')
const error = ref('')
const loading = ref(false)
async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (err) {
    const data = err.response?.data
    error.value = data?.message || data?.errors?.email?.[0] || data?.error || 'Error de red'
  } finally {
    loading.value = false
  }
}
</script>
