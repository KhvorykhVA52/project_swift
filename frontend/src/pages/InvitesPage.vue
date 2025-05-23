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
        <div class="invite-actions">
          <q-btn 
            color="positive" 
            size="sm" 
            label="Принять" 
            @click="acceptInvite(invite.id)"
          />
          <q-btn 
            color="negative" 
            size="sm" 
            label="Отклонить" 
            @click="rejectInvite(invite.id)"
            class="q-ml-sm"
          />
        </div>
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
    },
    async acceptInvite(inviteId) {
      try {
        const response = await api.responseInvite(inviteId, 'Принято');
        if (response) {
          await this.showMessage('Приглашение принято', 'positive');
          await this.getInvites();
        }
      } catch (error) {
        this.showMessage('Ошибка при принятии приглашения', 'negative');
      }
    },
    async rejectInvite(inviteId) {
      try {
        const response = await api.responseInvite(inviteId, 'Отклонено');
        if (response) {
          await this.showMessage('Приглашение отклонено', 'positive');
          await this.getInvites();
        }
      } catch (error) {
        this.showMessage('Ошибка при отклонении приглашения', 'negative');
      }
    },
    showMessage(message, type) {
      this.$q.notify({
        message,
        type,
        position: 'top',
      });
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.team-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.invite-actions {
    display: flex;
}
</style>