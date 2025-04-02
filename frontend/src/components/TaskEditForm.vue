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
import { Ref, ref } from 'vue';
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

const mainStore = useMainStore();

const props = defineProps<TaskEditProps>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const description = ref(props.task ? props.task.title : '');
const status: Ref<TaskStatus> = ref(
  props.task ? props.task.status : TaskStatus.new
);

const statusesDict: StatusRecord[] = [
  {
    label: 'Новая',
    value: TaskStatus.new,
  },
  {
    label: 'В работе',
    value: TaskStatus.inProgress,
  },
];

if (!props.new) {
  statusesDict.push({
    label: 'Выполнена',
    value: TaskStatus.done,
  });
}

const getStatusLabel = (status: TaskStatus) => {
  const statusOption = statusesDict.find((v) => v.value == status);
  if (statusOption) {
    return statusOption.label;
  } else {
    return 'Not found';
  }
};

async function onOKClick() {
  const newUser: CreateUpdateTaskDto = {
    title: description.value,
    status: status.value,
    assignee: assignee.value,
  };

  if (props.new) {
    await api.create(newUser);
  } else if (props.task) {
    await api.update(props.task?.id, newUser);
  }

  onDialogOK();
}

const onDelete = async () => {
  if (props.task) {
    await api.remove(props.task?.id);
    onDialogOK();
  }
};

const usersDict = ref([] as SecuredUser[]);
const assignee = ref(mainStore.getCurrentUser());
if (props.task) {
  assignee.value = props.task.assignee;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateFunction = (callback: () => void) => void;

const filterFn = async (val: string, update: UpdateFunction) => {
  if (usersDict.value.length > 0) {
    update(() => {
      // Здесь можно добавить логику, если нужно
    });
    return;
  }

  const users = await userApi.getAll();

  update(() => {
    usersDict.value = users;
  });
};
</script>
