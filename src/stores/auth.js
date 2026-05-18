import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/client'
import { unwrapData } from '@/api/response'

const TOKEN_KEY = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(value) {
    token.value = value || ''
    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  function clearSession() {
    setToken('')
    user.value = null
  }

  async function login(email, password) {
    const response = await api.post('/login', { email, password })
    const payload = unwrapData(response)
    setToken(payload.token)
    user.value = payload.user
    return payload
  }

  async function logout() {
    try {
      if (token.value) {
        await api.post('/logout')
      }
    } catch {
      // Legacy: logout still clears local session on API failure.
    } finally {
      clearSession()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    clearSession,
    setToken,
  }
})
