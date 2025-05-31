<template>

    <q-bar class="q-py-lg">
  
      <q-btn color="primary" @click="onNewClick">Создать</q-btn>
  
    </q-bar>
  
    <TIUUserDataTable :users="usersList" @user-click="onUserClick"></TIUUserDataTable>
  
  </template>
  
   
  
  <script setup lang="ts">
  
  import { onMounted, ref, Ref } from 'vue';
  
  import TIUUserDataTable from 'src/components/TIUUserDataTable.vue';
  
  import * as api from '../api/users.api';
  
  import { SecuredUser } from '../../../backend/src/common/types';
  
  import { useRouter } from 'vue-router';
  
   
  
  const router = useRouter();
  
   
  
  const usersList: Ref<SecuredUser[]> = ref([]);
  
   
  
  onMounted(async () => {
  
    usersList.value = await api.getAll();
  
    console.log(usersList.value);
  
  })
  
   
  
  const onUserClick = (row: SecuredUser) => {
  
    router.push({ path: `/users/${row.id}` })
  
  }
  
   
  
  const onNewClick = () => {
  
    router.push({ path: '/users/new' })
  
  }
  
   
  
  </script>