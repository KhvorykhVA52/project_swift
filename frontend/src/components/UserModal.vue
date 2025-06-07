<template>
  <q-dialog v-model="showModal" @hide="onDialogHide">
    <q-card style="min-width: 400px; max-width: 600px">
      <q-card-section class="bg-blue-6 text-white">
        <div class="row items-center">
          <div class="text-h6">Информация о пользователе</div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="close"
            class="q-ml-sm"
            v-close-popup
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row items-center q-mb-md">
          <q-avatar
            size="72px"
            color="primary"
            text-color="white"
            class="q-mr-md"
          >
            {{ userInitials }}
          </q-avatar>
          <div>
            <div class="text-h6">{{ user.firstname }} {{ user.lastname }}</div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-weight-medium q-mb-sm">Контактная информация</div>
        <div class="q-mb-sm row items-center">
          <q-icon name="email" size="sm" class="q-mr-sm" />
          {{ user.email || 'Не указан' }}
        </div>
        <div class="q-mb-sm row items-center">
          <q-icon name="phone" size="sm" class="q-mr-sm" />
          {{ user.phone || user.telephone || 'Не указан' }}
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-weight-medium q-mb-sm">Технологический стек</div>
        <div v-if="user.stack && user.stack.length > 0" class="q-gutter-sm">
          <q-chip
            v-for="(tech, index) in user.stack"
            :key="index"
            color="indigo"
            text-color="white"
            class="tech-chip"
          >
            {{ tech }}
          </q-chip>
        </div>
        <div v-else class="text-grey-6">Технологический стек не указан</div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1 q-pa-md">
        <q-btn flat label="Закрыть" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as api from '../api/users.api';

// Локальное определение интерфейса FullUserInfo
interface FullUserInfo {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  telephone?: string;
  position?: string;
  skills?: string[];
  competence?: string[];
}

// Локальный интерфейс, расширяющий FullUserInfo
interface ExtendedFullUserInfo extends FullUserInfo {
  phone?: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  telephone?: string;
  position?: string;
  skills?: string[];
  stack?: string[];
}

const showModal = ref(false);
const user = ref<Partial<User>>({});
const emit = defineEmits(['close']);

const userInitials = computed(() => {
  if (!user.value.firstname || !user.value.lastname) return '?';
  return `${user.value.firstname.charAt(0)}${user.value.lastname.charAt(0)}`;
});

const open = async (userData: Partial<User> | null | undefined) => {
  if (!userData || !userData.id) return;

  try {
    const fullUserData: ExtendedFullUserInfo = await api.getUserById(userData.id);
    user.value = {
      ...userData,
      email: fullUserData.email || 'Не указан',
      phone: fullUserData.phone || fullUserData.telephone || 'Не указан',
      stack: fullUserData.competence || []
    };
  } catch (error) {
    console.error('Ошибка загрузки данных пользователя:', error);
    user.value = {
      ...userData,
      phone: userData.phone || userData.telephone || 'Не указан'
    };
  }

  showModal.value = true;
};

const onDialogHide = () => {
  emit('close');
};

defineExpose({ open });
</script>


<style scoped>
.skill-chip, .tech-chip {
  margin: 4px;
}

.q-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.q-dialog__backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.position-text {
  color: lightblue;
}
</style>
