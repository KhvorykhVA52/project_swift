<template>
  <q-list>
    <template v-if="isUser">
      <q-item-label header>
        Администрирование
      </q-item-label>

      <q-item clickable to="/users">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Пользователи</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-if="isAdmin">
      <q-item-label header>
        Основной раздел
      </q-item-label>

      <q-item clickable to="/tasks">
        <q-item-section avatar>
          <q-icon name="fact_check" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Задачи</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useMainStore } from 'src/stores/main-store'
import { computed } from 'vue'

const mainStore = useMainStore()
const isUser = computed(() => mainStore.isUser())
const isAdmin = computed(() => mainStore.isAdmin())
</script>