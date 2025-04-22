<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-center">
          <span v-if="!props.new">Редактирование</span>
          <span v-if="props.new">Новая задача</span>
        </div>
      </q-card-section>
      <q-card-section>
        <q-input label="Описание" v-model="description" dense />
        <q-select
          v-model="status"
          :options="statusesDict"
          label="Статус"
          emit-value
          :display-value="getStatusLabel(status)"
        />
        <q-select
          v-model="assignee"
          :options="usersDict"
          label="Исполнитель"
          :option-value="'id'"
          :option-label="(item) => `${item.lastname} ${item.firstname}`"
          :display-value="`${assignee?.lastname} ${assignee?.firstname}`"
          @filter="filterFn"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Сохранить" @click="onOKClick" />
        <q-btn color="primary" label="Отмена" @click="onDialogCancel" />
        <q-btn
          v-if="!props.new"
          color="red"
          label="Удалить"
          @click="onDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import {
  CreateUpdateTaskDto,
  SecuredUser,
  TaskDto,
  TaskStatus,
} from '../../../backend/src/common/types';
import { ref } from 'vue';
import * as api from '../api/tasks.api';
import * as userApi from '../api/users.api';
import { useMainStore } from 'src/stores/main-store';

interface TaskEditProps {
  new: boolean;
  task?: TaskDto;
}

type StatusRecord = {
  label: string;
  value: TaskStatus;
};

type UpdateFunction = (callback: () => void) => void;

const mainStore = useMainStore();
const props = defineProps<TaskEditProps>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const description = ref(props.task?.title ?? '');
const status = ref<TaskStatus>(props.task?.status ?? TaskStatus.new);
const usersDict = ref<SecuredUser[]>([]);
const assignee = ref<SecuredUser | undefined>(props.task?.assignee ?? mainStore.getCurrentUser());

const statusesDict: StatusRecord[] = [
  { label: 'Новая', value: TaskStatus.new },
  { label: 'В работе', value: TaskStatus.inProgress },
  ...(!props.new ? [{ label: 'Выполнена', value: TaskStatus.done }] : [])
];

const getStatusLabel = (status: TaskStatus) => 
  statusesDict.find(v => v.value === status)?.label ?? 'Неизвестно';

async function onOKClick() {
  if (!assignee.value) {
    console.error('Исполнитель не выбран');
    return;
  }

  const taskData: CreateUpdateTaskDto = {
    title: description.value,
    status: status.value,
    assignee: assignee.value
  };

  try {
    if (props.new) {
      await api.create(taskData);
    } else if (props.task?.id) {
      await api.update(props.task.id, taskData);
    }
    onDialogOK();
  } catch (error) {
    console.error('Ошибка сохранения задачи:', error);
  }
}

const onDelete = async () => {
  if (props.task?.id) {
    try {
      await api.remove(props.task.id);
      onDialogOK();
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  }
};

const filterFn = async (val: string, update: UpdateFunction) => {
  if (usersDict.value.length > 0) {
    update(() => {
      if (val) {
        const needle = val.toLowerCase();
        usersDict.value = usersDict.value.filter(
          user => `${user.lastname} ${user.firstname}`.toLowerCase().includes(needle)
        );
      }
    });
    return;
  }

  try {
    const users = await userApi.getAll();
    update(() => {
      usersDict.value = users;
    });
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};
</script>