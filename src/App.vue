<template>
  <div v-if="showNav" class="nav">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/products">Productos</router-link>
    <router-link to="/categories">Categorías</router-link>
    <button type="button" @click="onLogout">Salir</button>
  </div>
  <router-view />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const showNav = computed(() => route.name !== 'login')

async function onLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
