<template>
  <div class="flex min-h-screen flex-col">
    <header
      v-if="showNav"
      class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <router-link to="/dashboard" class="flex items-center gap-3">
          <span
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/40"
          >
            LP
          </span>
          <span class="hidden font-semibold text-white sm:inline">Legacy Products</span>
        </router-link>

        <nav class="flex items-center gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            active-class="!bg-indigo-500/15 !text-indigo-300"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <button type="button" class="btn-secondary text-xs" @click="onLogout">
          Salir
        </button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <router-view />
    </main>

    <footer
      v-if="showNav"
      class="border-t border-white/5 py-4 text-center text-xs text-slate-500"
    >
      Prueba tÃ©cnica Â· Vue 3 + Laravel API
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const showNav = computed(() => route.name !== 'login')

const navLinks = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'products', label: 'Productos' },
  { name: 'categories', label: 'CategorÃ­as' },
]

async function onLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
