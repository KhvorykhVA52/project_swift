<template>

    <div>

        <q-table :rows="props.users" :columns="columns" row-key="name" @row-click="onRowClick" />

    </div>

</template>

<script lang="ts" setup>

import { SecuredUser } from '../../../backend/src/common/types';

 

interface UserTableProps {

    users: SecuredUser[];

}

 

const emit = defineEmits(['user-click'])

 

const props = withDefaults(defineProps<UserTableProps>(), { users: () => [] });

 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any = [

    {

        name: 'login',

        label: 'Логин',

        align: 'left',

        field: 'name',

        sortable: true

    },

    {

        name: 'firstname',

        label: 'Имя',

        align: 'left',

        field: 'firstname',

        sortable: true

    },

    {

        name: 'lastname',

        label: 'Фамилия',

        align: 'left',

        field: 'lastname',

        sortable: true

    },

    {

        name: 'roles',

        label: 'Роли',

        align: 'left',

        field: (row: SecuredUser) => row.roles.join(', '),

        sortable: true

    },

    {

        name: 'status',

        label: 'Статус',

        align: 'left',

        field: 'status',

        sortable: true

    }

];

 

const onRowClick = (evt: unknown, row: unknown) => {

    emit('user-click', row)

}

</script>