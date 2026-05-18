<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button type="button" :disabled="loading" @click="submit">Ingresar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
    error.value = data?.message || data?.error || 'Error de red'
  } finally {
    loading.value = false
  }
}
</script>
