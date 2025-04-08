<template>
  <div>
    <!-- Панель управления командой -->
    <div class="team-management-panel">
      <button class="create-team-btn" @click="showCreateTeamModal = true">
        Создать команду
      </button>
    </div>

    <!-- Основное окно со списком команд -->
    <div v-for="(team, index) in teams" :key="index" class="team-block q-mb-md">
      <div class="team-header">
        <div class="team-name text-h6 text-weight-bold text-grey-9">{{ team.name }}</div>
        <div class="team-actions">
          <button class="edit-btn" @click.stop="editTeam(team)">Редактировать</button>
          <button class="invite-btn" @click.stop="openInviteModal(team)">Пригласить в команду</button>
        </div>
      </div>
      <div class="team-description text-grey-7">
        {{ truncatedDescription(team.description, 100) }}
      </div>
      <div class="team-members row q-mt-sm">
        <div
          v-for="(member, memberIndex) in limitedMembers(team.members)"
          :key="memberIndex"
          class="member-block col-auto q-pa-sm"
          :class="memberIndex % 2 === 0 ? 'bg-grey-2' : 'bg-grey-3'"
          :style="{ marginLeft: memberIndex > 0 ? '12px' : '0px' }"
        >
          <div class="member-firstname text-grey-8">
            {{ truncatedText(member.firstname, 12) }}
          </div>
          <div class="member-lastname text-grey-8">
            {{ truncatedText(member.lastname, 12) }}
          </div>
        </div>
        <div v-if="team.members.length > 7" class="text-grey-7 q-ml-sm">...</div>
      </div>
    </div>

    <!-- Модальное окно с информацией о команде -->
    <div v-if="selectedTeam" class="team-details-modal">
      <div class="team-details-modal-content">
        <button @click="closeTeamDetails" class="team-details-close-button">Закрыть</button>

        <div class="team-details-team-info-container">
          <h3 class="team-details-team-name-header">{{ selectedTeam.name }}</h3>
          <div class="team-details-team-description-wrapper">
            <p class="team-details-team-description-text">{{ selectedTeam.description }}</p>
          </div>
        </div>

        <div class="team-details-members-container">
          <div class="team-details-leader-wrapper">
            <div v-if="leader" class="team-details-member-box leader-box">
              <div class="team-details-member-firstname">{{ leader.firstname }}</div>
              <div class="team-details-member-lastname">{{ leader.lastname }}</div>
              <div class="team-details-leader-label">Тимлидер</div>
            </div>
          </div>

          <div v-for="(member, index) in filteredMembersWithoutLeader" :key="index" class="member-box">
            <div class="team-details-member-firstname">{{ member.firstname }}</div>
            <div class="team-details-member-lastname">{{ member.lastname }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания команды -->
    <div v-if="showCreateTeamModal" class="modal-overlay">
      <div class="modal-content create-team-modal">
        <h3>Создать команду</h3>
        <div class="form-group">
          <label for="teamName">Название команды:</label>
          <input type="text" id="teamName" v-model="newTeam.name" />
        </div>
        <div class="form-group">
          <label for="teamDescription">Описание команды:</label>
          <textarea id="teamDescription" v-model="newTeam.description"></textarea>
        </div>
        <div class="modal-actions">
          <button class="save-btn" @click="saveTeam">Сохранить</button>
          <button class="cancel-btn" @click="showCreateTeamModal = false">
            Отмена
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования команды -->
    <div v-if="showEditTeamModal" class="modal-overlay">
      <div class="modal-content edit-team-modal">
        <h3>Редактировать команду</h3>
        <div class="form-group">
          <label for="editTeamName">Название команды:</label>
          <input type="text" id="editTeamName" v-model="editingTeam.name" />
        </div>
        <div class="form-group">
          <label for="editTeamDescription">Описание команды:</label>
          <textarea id="editTeamDescription" v-model="editingTeam.description"></textarea>
        </div>
        <div class="modal-actions">
          <button class="save-btn" @click="updateTeam">Сохранить</button>
          <button class="cancel-btn" @click="showEditTeamModal = false">
            Отмена
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно приглашения пользователей -->
    <div v-if="showInviteModal" class="modal-overlay">
      <div class="modal-content invite-modal">
        <h3>Пригласить в команду "{{ currentTeam.name }}"</h3>
        <div class="users-list">
          <div 
            v-for="user in availableUsers" 
            :key="user.id" 
            class="user-item"
            @click="selectUser(user)"
          >
            <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
            <div class="user-group">{{ user.group }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения приглашения -->
    <div v-if="showInviteConfirmation" class="modal-overlay">
      <div class="modal-content confirmation-modal">
        <h3>Подтверждение приглашения</h3>
        <div class="user-info">
          <p><strong>Имя:</strong> {{ selectedUser.firstname }}</p>
          <p><strong>Фамилия:</strong> {{ selectedUser.lastname }}</p>
          <p><strong>Группа:</strong> {{ selectedUser.group }}</p>
        </div>
        <p class="confirmation-question">Пригласить данного пользователя в команду?</p>
        <div class="confirmation-actions">
          <button class="confirm-btn" @click="confirmInvite">Да</button>
          <button class="cancel-btn" @click="showInviteConfirmation = false">Нет</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TeamsPage',
  data() {
    return {
      teams: [
        {
          id: 1,
          name: 'Команда 1',
          description: 'Описание команды 1',
          members: [
            { id: 1, firstname: 'Иван', lastname: 'Иванов', group: 'Группа 1' },
            { id: 2, firstname: 'Петр', lastname: 'Петров', group: 'Группа 2' },
            { id: 3, firstname: 'Сергей', lastname: 'Сергеев', group: 'Группа 1' }
          ],
          leader: { id: 1, firstname: 'Иван', lastname: 'Иванов', group: 'Группа 1' }
        },
        {
          id: 2,
          name: 'Команда 2',
          description: 'Описание команды 2',
          members: [
            { id: 4, firstname: 'Алексей', lastname: 'Алексеев', group: 'Группа 3' },
            { id: 5, firstname: 'Дмитрий', lastname: 'Дмитриев', group: 'Группа 2' }
          ],
          leader: { id: 4, firstname: 'Алексей', lastname: 'Алексеев', group: 'Группа 3' }
        }
      ],
      availableUsers: [
        { id: 6, firstname: 'Николай', lastname: 'Николаев', group: 'Группа 1' },
        { id: 7, firstname: 'Михаил', lastname: 'Михайлов', group: 'Группа 2' },
        { id: 8, firstname: 'Андрей', lastname: 'Андреев', group: 'Группа 3' }
      ],
      showCreateTeamModal: false,
      showEditTeamModal: false,
      showInviteModal: false,
      showInviteConfirmation: false,
      newTeam: {
        name: '',
        description: '',
      },
      editingTeam: {
        id: null,
        name: '',
        description: '',
      },
      currentTeam: {
        id: null,
        name: '',
      },
      selectedTeam: null,
      selectedUser: null,
    };
  },
  computed: {
    leader() {
      return this.selectedTeam ? this.selectedTeam.leader : null;
    },
    filteredMembersWithoutLeader() {
      if (!this.selectedTeam) {
        return [];
      }
      return this.selectedTeam.members.filter(member => 
        !this.isLeader(member, this.selectedTeam.leader)
      );
    },
  },
  methods: {
    isLeader(member, leader) {
      if (!leader) return false;
      return member.id === leader.id;
    },
    editTeam(team) {
      this.editingTeam = {
        id: team.id,
        name: team.name,
        description: team.description
      };
      this.showEditTeamModal = true;
    },
    updateTeam() {
      const index = this.teams.findIndex(t => t.id === this.editingTeam.id);
      if (index !== -1) {
        this.teams[index].name = this.editingTeam.name;
        this.teams[index].description = this.editingTeam.description;
      }
      this.showEditTeamModal = false;
    },
    openInviteModal(team) {
      this.currentTeam = {
        id: team.id,
        name: team.name
      };
      this.showInviteModal = true;
    },
    selectUser(user) {
      this.selectedUser = user;
      this.showInviteModal = false;
      this.showInviteConfirmation = true;
    },
    confirmInvite() {
      // Здесь должна быть логика добавления пользователя в команду
      // В демо-версии просто закрываем модальные окна
      this.showInviteConfirmation = false;
    },
    openTeamDetails(team) {
      this.selectedTeam = team;
    },
    closeTeamDetails() {
      this.selectedTeam = null;
    },
    truncatedDescription(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    truncatedText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    limitedMembers(members) {
      if (!Array.isArray(members)) {
        return [];
      }
      return members.slice(0, 7);
    },
    saveTeam() {
      const newId = Math.max(...this.teams.map(t => t.id), 0) + 1;
      this.teams.push({
        id: newId,
        name: this.newTeam.name,
        description: this.newTeam.description,
        members: [],
        leader: null
      });
      this.showCreateTeamModal = false;
      this.newTeam = {
        name: '',
        description: '',
      };
    },
  },
});
</script>

<style scoped>
.team-management-panel {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  text-align: left;
}

.create-team-btn {
  background-color: #1e88e5;
  color: white;
  font-size: 1em;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.create-team-btn:hover {
  background-color: #1976d2;
}

.team-block {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.team-block:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.team-name {
  color: #1f1c2e;
  font-size: 1.25rem;
}

.team-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .invite-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.invite-btn {
  background-color: #4caf50;
  color: white;
}

.invite-btn:hover {
  background-color: #43a047;
}

.team-description {
  color: #4a4a4a;
  margin-bottom: 12px;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.member-block {
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  min-width: 80px;
}

.member-firstname,
.member-lastname {
  color: #1f1c2e;
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bg-grey-2 {
  background-color: #e0e3e9;
}

.bg-grey-3 {
  background-color: #d0d3d9;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1f1c2e;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #1f1c2e;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn, .cancel-btn, .confirm-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn, .confirm-btn {
  background-color: #4caf50;
  color: white;
}

.save-btn:hover, .confirm-btn:hover {
  background-color: #43a047;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #e53935;
}

/* Стили для окна приглашения */
.users-list {
  margin-top: 15px;
}

.user-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.user-name {
  font-weight: bold;
  color: #1f1c2e;
}

.user-group {
  color: #666;
  font-size: 0.9em;
}

/* Стили для окна подтверждения */
.user-info {
  margin-bottom: 20px;
}

.user-info p {
  margin: 5px 0;
}

.confirmation-question {
  font-size: 1.1em;
  margin: 20px 0;
  text-align: center;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* Стили для окна деталей команды */
.team-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.team-details-modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
}

.team-details-close-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  margin-bottom: 15px;
}

.team-details-close-button:hover {
  background-color: #c82333;
}

.team-details-team-info-container {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.team-details-team-name-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #343a40;
}

.team-details-team-description-text {
  font-size: 16px;
  color: #495057;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.team-details-members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.team-details-member-box {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 10px;
  width: calc(50% - 10px);
  text-align: center;
}

.team-details-member-firstname {
  font-size: 14px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 5px;
}

.team-details-member-lastname {
  font-size: 14px;
  color: #495057;
}

.team-details-leader-label {
  background-color: #ffc107;
  color: #212529;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  margin-top: 5px;
}

.leader-box {
  order: -1;
  background-color: #d0e9c6;
  width: 100%;
}

.team-details-leader-wrapper {
  width: 100%;
  margin-bottom: 10px;
}
</style>