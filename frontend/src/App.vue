<script setup lang="ts">
import { useRouter } from 'vue-router'
import { refresh } from './api/auth.api'
import { useMainStore } from './stores/main-store'
import { onMounted } from 'vue'
import { api } from './api/axios'
import { useQuasar } from 'quasar'

const router = useRouter()
const mainStore = useMainStore()
const $q = useQuasar()

onMounted(async () => {
  try {
    const savedSession = await refresh()
    if (savedSession) {
      // Создаем объект, строго соответствующий LoginResponseDto
      const loginResponse = {
        access_token: savedSession.access_token,
        roles: savedSession.roles,
        userId: savedSession.userId,
        // Добавляем обязательные поля с fallback-значениями
        username: savedSession.username || '',
        firstname: savedSession.firstname || '',
        lastname: savedSession.lastname || ''
      }
      mainStore.initAppState(loginResponse)
    } else {
      await router.push('/login')
    }
  } catch (error) {
    console.error('Initialization error:', error)
    await router.push('/login')
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      $q.notify({
        type: 'negative',
        position: 'bottom',
        message: 'Ошибка авторизации',
        icon: 'self_improvement',
        timeout: 2000
      })
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
</script>

<template>
  <router-view />
</template>