<template>
  <div class="my-page-content">
    <div class="q-gutter-md">
      <q-input
        v-model.number='ownerId'
        label='ID владельца команды'
        type='number'
      />
      <q-input
        v-model.number='memberId'
        label='ID кого взять в команду'
        type='number'
      />
      <q-btn color='primary' label='Взять в команду' @click='addToTeam' />
      <q-btn color='secondary' label='Создать команду' @click='createTeam' /> 

      <div v-if='message' class='q-mt-md'>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import * as api from '../api/teams.api';


export default {
  setup() {
    const ownerId = ref(null);
    const memberId = ref(null);
    const message = ref('');

    const createTeam = async () => {
     if (ownerId.value === null || memberId.value === null) {
        message.value = 'Пожалуйста, введите ID владельца';
        return;
     }
     const newTeam = {
       name: 'TestName',
       description: 'TestDescrtiption',
     }

     const response = await api.create(ownerId.value, newTeam);
      
     console.log(response.data);

    }	

    const addToTeam = async () => {
      if (ownerId.value === null || memberId.value === null) {
        message.value = 'Пожалуйста, введите ID владельца и ID участника.';
        return;
      }

      const response = await api.AddInByOne(ownerId.value, memberId.value);
      console.log(response.status);
      memberId.value = null;
    };

    return {
      ownerId,
      memberId,
      message,
      createTeam,
      addToTeam,
    };
  },
};
</script>

<style scoped>
.my-page-content {
  padding: 20px; /* Или другие стили для контента вашей страницы */
}
</style>