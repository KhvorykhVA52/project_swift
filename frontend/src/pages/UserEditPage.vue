<template>

    <div class="q-pa-md">
  
      <div class="text-center">
  
        <span v-if="mode == 'update'">Редактирование</span>
  
        <span v-if="mode == 'new'">Создание нового</span>
  
      </div>
  
      <q-input label="Логин" v-model="name" dense />
  
      <q-input label="Имя" v-model="firstname" dense />
  
      <q-input label="Фамилия" v-model="lastname" dense />
  
      <q-input v-if="mode == 'new'" type="password" label="Пароль" v-model="password" dense />
  
      <q-select v-model="roles" multiple use-chips :options="rolesDict" label="Роли" />
  
      <q-select v-model="status" :options="statusDict" label="Статус" />
  
   
  
      <div class="text-center q-py-md">
  
        <q-btn color="positive" label="Сохранить" @click="onSave"></q-btn>
  
      </div>
  
    </div>
  
  </template>
  
   
  <script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as api from '../api/users.api';
import { useQuasar } from 'quasar';
import {
  CreateUserDto,
  UpdateUserDto,
  Role,
  UserAccountStatus
} from '../../../backend/src/common/types';

type Mode = 'new' | 'update';

const mode: Ref<Mode> = ref('new');
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const id = ref(-1);
const name = ref('');
const firstname = ref('');
const lastname = ref('');
const password = ref('');
const group = ref('');
const telephone = ref('');
const roles: Ref<Role[]> = ref([Role.user]);
const rolesDict = [Role.admin, Role.user];
const status: Ref<UserAccountStatus> = ref(UserAccountStatus.active);
const statusDict = [UserAccountStatus.active, UserAccountStatus.inactive, UserAccountStatus.pending];

onMounted(async () => {
  if (route.params.id === 'new') {
    mode.value = 'new';
  } else {
    mode.value = 'update';
    id.value = +route.params.id;
    await loadUserData();
  }
});

const loadUserData = async () => {
  const response = await api.get(id.value);
  if (response) {
    firstname.value = response.firstname;
    lastname.value = response.lastname;
    name.value = response.email;
    group.value = response.group || '';
    telephone.value = response.telephone || '';
    roles.value = response.roles;
    status.value = response.status;
  }
};

const onSave = async () => {
  try {
    if (mode.value === 'new') {
      const newUser: CreateUserDto = {
        email: name.value,
        firstname: firstname.value,
        lastname: lastname.value,
        password: password.value,
        roles: roles.value,
        status: status.value,
        group: group.value,
        telephone: telephone.value
      };

      const response = await api.create(newUser);
      if (response) {
        router.push({ path: `/users/${response.id}` });
      }
    } else {
      const updatedUser: UpdateUserDto = {
        ...(name.value && { email: name.value }),
        ...(firstname.value && { firstname: firstname.value }),
        ...(lastname.value && { lastname: lastname.value }),
        roles: roles.value,
        status: status.value,
        ...(group.value && { group: group.value }),
        ...(telephone.value && { telephone: telephone.value })
      };

      const response = await api.update(id.value, updatedUser);
      if (response) {
        $q.notify({
          message: 'Данные успешно сохранены',
          color: 'positive',
          timeout: 2000
        });
      }
    }
  } catch (error) {
    $q.notify({
      message: 'Ошибка при сохранении',
      color: 'negative',
      timeout: 2000
    });
    console.error('Ошибка сохранения:', error);
  }
};
</script>