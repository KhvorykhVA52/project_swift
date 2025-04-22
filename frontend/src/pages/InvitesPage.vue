<template>
  <div class="invite-list-container">
    <h1 style="font-size: 20px;">Список приглашений в команды</h1>
    <ul class="invite-list">
      <li
        v-for="(invite, index) in invites"
        :key="index"
        class="invite-item"
      >
        <div class="team-name">{{ invite.team.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as api from '../api/invites.api';

export default defineComponent ({
  name: 'InvitesPage',
  data() {
    return {
      invites: [],
    }
  },
  async mounted() {
    await this.getInvites();
  },
  methods: {
    async getInvites() {
      const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
      
      if (!parsedSession) {
        console.error('Ошибка при получении информации о сессии:'. error);
        return;
      }

      const response = await api.getInvites(parsedSession.userId);
      console.log(response);

      if (response) {
        this.invites = response;
      }
    }
  }
});
</script>

<style>
.invite-list-container {
    max-width: 600px;
    margin: 0 auto;
}

.invite-list {
    list-style: none;
    padding: 0;
}

.invite-item {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.team-name {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>