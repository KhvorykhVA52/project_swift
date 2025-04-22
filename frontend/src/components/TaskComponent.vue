<template>
  <q-card>
    <q-card-section>
      <div>{{ $props.value.title }}</div>
      <template v-if="$props.value.assignee">
        <div>{{ $props.value.assignee.firstname }} {{ $props.value.assignee.lastname }}</div>
      </template>
      <template v-else>
        <div>Исполнитель не назначен</div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { TaskDto } from '../../../backend/src/common/types';

defineProps<{
  value: TaskDto
}>();
</script>