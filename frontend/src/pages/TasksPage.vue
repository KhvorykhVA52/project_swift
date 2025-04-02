<template>

  <q-bar class="q-pa-lg">

    <q-btn color="primary" @click="onNewClick">Создать</q-btn>

    <div>Фильтр:</div>

    <q-checkbox v-model="onlyMyTasks" label="Только назначенные на меня" />

    <q-input class="q-px-lg" outlined dense v-model="searchText" label="Поиск">

      <template v-slot:append>

        <q-icon name="search" color="orange" />

      </template>

    </q-input>

    <q-btn icon="cancel" label="Сброс фильтра" @click="onFilterReset"></q-btn>

  </q-bar>

  <div class="row">

    <div class="col text-center text-h5">Новые</div>

    <div class="col text-center text-h5">В работе</div>

    <div class="col text-center text-h5">Выполненные</div>

  </div>

  <div class="row">

    <div class="col q-pa-sm">

      <TaskComponent

        class="q-mb-sm"

        v-for="task in newTasks"

        :key="task.id"

        :value="task"

        @onEditClick="onTaskEdit"

      ></TaskComponent>

    </div>

    <div class="col q-pa-sm">

      <TaskComponent

        class="q-mb-sm"

        v-for="task in inProgressTasks"

        :key="task.id"

        :value="task"

        @onEditClick="onTaskEdit"

      ></TaskComponent>

    </div>

    <div class="col q-pa-sm">

      <TaskComponent

        class="q-mb-sm"

        v-for="task in doneTasks"

        :key="task.id"

        :value="task"

        @onEditClick="onTaskEdit"

      ></TaskComponent>

    </div>

  </div>

</template>

 

<script setup lang="ts">

import { useQuasar } from 'quasar';

import TaskEditForm from '../components/TaskEditForm.vue';

import TaskComponent from 'src/components/TaskComponent.vue';

import { computed, onMounted, ref } from 'vue';

import * as api from '../api/tasks.api';

import { TaskDto, TaskStatus } from '../../../backend/src/common/types';

import { useMainStore } from 'src/stores/main-store';

import { storeToRefs } from 'pinia';

 

const $q = useQuasar();

 

const mainStore = useMainStore();

 

let { userId } = storeToRefs(mainStore);

 

const onlyMyTasks = ref(false);

const searchText = ref('');

 

const allTasks = ref([] as TaskDto[]);

 

const filteredTasks = computed(() => {

  return allTasks.value.filter((task) => {

    console.log('Task filter.');

 

    let visible = true;

    if (onlyMyTasks.value && task.assignee.id != userId.value) {

      visible = false;

    }

 

    if (

      searchText.value.length > 1 &&

      task.title.indexOf(searchText.value) < 0

    ) {

      visible = false;

    }

 

    return visible;

  });

});

 

const newTasks = computed(() =>

  filteredTasks.value.filter((v) => v.status == TaskStatus.new)

);

const inProgressTasks = computed(() =>

  filteredTasks.value.filter((v) => v.status == TaskStatus.inProgress)

);

const doneTasks = computed(() =>

  filteredTasks.value.filter((v) => v.status == TaskStatus.done)

);

 

const getTasksFromServer = async () => {

  const response = await api.getTasks();

  allTasks.value = response;

};

 

onMounted(async () => {

  await getTasksFromServer();

});

 

const onNewClick = async () => {

  $q.dialog({

    component: TaskEditForm,

 

    // props forwarded to your custom component

    componentProps: {

      new: true,

    },

  })

    .onOk(async () => {

      console.log('OK');

      await getTasksFromServer();

    })

    .onCancel(() => {

      console.log('Cancel');

    });

};

 

const onTaskEdit = (value: TaskDto) => {

  console.log(value);

  $q.dialog({

    component: TaskEditForm,

 

    // props forwarded to your custom component

    componentProps: {

      new: false,

      task: value,

    },

  })

    .onOk(async () => {

      console.log('OK');

      await getTasksFromServer();

    })

    .onCancel(() => {

      console.log('Cancel');

    });

};

 

const onFilterReset = () => {

  onlyMyTasks.value = false;

  searchText.value = '';

};

</script>