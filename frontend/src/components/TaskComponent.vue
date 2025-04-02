<template>

  <q-card class="my-card" flat bordered>

    <q-card-section horozontal>

      <q-card-section class="q-pt-xs">

        <div class="text-h6">{{ $props.value.title }}</div>

      </q-card-section>

      <q-card-section class="q-pa-none">

        Создана: {{ creationDate }}</q-card-section

      >

      <q-card-section class="q-pa-none">

        Исполнитель:

        {{

          `${$props.value.assignee.firstname}

        ${$props.value.assignee.lastname}`

        }}</q-card-section

      >

      <q-card-section class="q-pa-none">

        Автор:

        {{

          `${$props.value.author.firstname}

        ${$props.value.author.lastname}`

        }}</q-card-section

      >

    </q-card-section>

 

    <q-separator />

 

    <q-card-actions>

      <q-btn flat icon="edit" label="Изменить" @click="onChangeClick" />

    </q-card-actions>

  </q-card>

</template>
  
   
  
  <script setup lang="ts">
  
  import { TaskDto } from '../../../backend/src/common/types';
  
  import { date } from 'quasar';
  
   
  
  interface TaskComponentProps {
  
    value: TaskDto;
  
  }
  
   
  
  const emit = defineEmits(['on-edit-click']);
  
   
  
  const props = defineProps<TaskComponentProps>();
  
   
  
  const creationDate = date.formatDate(props.value.createdAt, 'DD.MM.YYYY');
  
   
  
  const onChangeClick = () => {
  
    emit('on-edit-click', props.value);
  
  };
  
  </script>