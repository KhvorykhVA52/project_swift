<template>
  <q-dialog v-model="showModal" @hide="onDialogHide">
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="bg-blue-6 text-white">
        <div class="row items-center">
          <div class="text-h6">{{ team.name }}</div>
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
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Описание</div>
        <div class="q-mb-md">{{ team.description || 'Нет описания' }}</div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-weight-medium q-mb-sm">Технологический стек</div>
        <div v-if="team.stack && team.stack.length > 0" class="q-gutter-sm">
          <q-chip
            v-for="(tech, index) in team.stack"
            :key="index"
            color="indigo"
            text-color="white"
            class="tech-chip"
          >
            {{ tech }}
          </q-chip>
        </div>
        <div v-else class="text-grey-6">Стек не указан</div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-weight-medium q-mb-sm">Участники ({{ team.members?.length || 0 }})</div>
        <div v-if="team.members && team.members.length > 0">
          <q-list bordered separator>
             <q-item
              v-for="member in team.members"
              :key="member.id"
              clickable
              @click="userModalRef?.open(member)"
              class="member-item"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ memberInitials(member) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ member.firstname }} {{ member.lastname }}</q-item-label>
                <q-item-label caption>{{ member.position || 'Должность не указана' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else class="text-grey-6">Участники не добавлены</div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1 q-pa-md">
        <q-btn flat label="Закрыть" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserModal from './UserModal.vue';

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  position?: string;
  skills?: string[];
}

interface Team {
  id: number;
  name: string;
  description?: string;
  stack?: string[];
  members?: Member[];
}

const showModal = ref(false);
const team = ref<Partial<Team>>({});
const userModalRef = ref<InstanceType<typeof UserModal> | null>(null);

const emit = defineEmits(['close']);

const memberInitials = (member: Member) => {
  return `${member.firstname?.charAt(0) || ''}${member.lastname?.charAt(0) || ''}`;
};

const open = (teamData: Partial<Team>) => {
  team.value = { ...teamData };
  showModal.value = true;
};

const onDialogHide = () => {
  emit('close');
};

defineExpose({ open });
</script>

<style scoped>
.tech-chip {
  margin: 4px;
}

.member-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.q-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.q-dialog__backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
