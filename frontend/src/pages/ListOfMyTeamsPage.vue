<template>
  <div v-if="isTeamowner">
    <!-- Панель управления командой -->
    <div class="team-management-panel">
      <button class="create-team-btn" @click="showCreateTeamModal = true">
        Создать команду
      </button>
    </div>

    <!-- Основное окно со списком команд -->
    <div v-for="(team, index) in teams" :key="index" class="team-block q-mb-md" @click="openTeamDetails(team)">
      <div class="team-name text-h6 text-weight-bold text-grey-9">{{ team.name }}</div>
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
        <button @click="openInviteDialog" class="team-invite-invite-button">Пригласить в команду</button>
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

    <!-- Модальное окно приглашения в команду -->
    <div v-if="showInviteDialog" class="invite-dialog">
      <div class="invite-dialog-content">
        <h3>Пригласить участника</h3>
        <input type="text" v-model="searchQuery" placeholder="Поиск">
        <div class="user-list">
          <div v-for="(user, index) in filteredUsers" :key="index" class="user-block" @click="selectUser(user)" style="cursor: pointer;">
            <div class="user-info">{{ truncate(user.firstname) }}</div>
            <div class="user-info">{{ truncate(user.lastname) }}</div>
            <div class="user-info">{{ truncate(user.group) }}</div>
            <hr v-if="index < filteredUsers.length - 1">
          </div>
          <div v-if="filteredUsers.length === 0" class="no-results">
            Ничего не найдено.
          </div>
        </div>
        <div class="dialog-buttons">
          <button @click="closeInviteDialog">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения отправки приглашения -->
    <div v-if="showInviteCheck" class="invite-check-modal">
      <div class="invite-check-content">
        <h3>Отправить приглашение в команду?</h3>
        <p>Имя: {{ selectedUser.firstname }}</p>
        <p>Фамилия: {{ selectedUser.lastname }}</p>
        <p>Группа: {{ selectedUser.group }}</p>
        <div>
          <button @click="sendInvitation" class="invite-check-send-button">Отправить</button>
          <button @click="closeInviteCheck" class="invite-check-deny-button">Отмена</button>
        </div>
      </div>
    </div>
    <div v-if="confirmationModalVisible" class="modal-backdrop"></div>

    <!-- Модальное временное окно по показу удачного отправки приглашения -->
    <div v-if="showInviteOK" :class="['invite-ok-message', { 'hidden': !showInviteOK }]">
      Приглашение отправлено!
    </div>

    <!-- Модальное временное окно по показу ошибки отправки приглашения -->
    <div v-if="showInviteERROR" :class="['invite-error-message', { 'hidden': !showInviteERROR }]">
      Не получилось отправить приглашение
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
  </div>

  <div v-if="!isTeamowner">
    <div v-if="selectedTeam" class="team-details-notowner-modal">
      <div class="team-details-modal-content">
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
  </div>
</template>



<script>
import * as api from '../api/teams.api';
import { defineComponent } from 'vue';
import { CreateTeamDto } from '../../../backend/src/teams/dto/create-team.dto';
import { CreateInviteDto } from '../../../backend/src/teams/dto/create-invite.dto';

export default defineComponent({
  name: 'TeamsPage',
  data() {
    return {
      teams: null,
      showCreateTeamModal: false,
      newTeam: null,
      selectedTeam: null,
      showInviteDialog: false,
      users: null,
      truncate: null,
      searchQuery: '',
      selectedUser: null,
      showInviteCheck: false,
      showInviteOK: false,
      showInviteERROR: false,
      timerId: null,
      isTeamowner: false,
    };
  },
  async mounted() {
    await this.IsTeamowner();
    await this.loadTeams();
    await this.loadUsers();
  },
  computed: {
    leader() {
        return this.selectedTeam ? this.selectedTeam.leader : null;
    },
    filteredMembersWithoutLeader() {
      if (!this.selectedTeam) {
        return [];
      }
      return this.selectedTeam.members.filter(member => !this.isOwner(member, this.selectedTeam.owner) && !this.isLeader(member, this.selectedTeam.leader));
    },
    filteredUsers() {
      if (!this.users) {
        return []; // или return [], чтобы вернуть пустой массив
      }

      const query = this.searchQuery.toLowerCase();
      const searchTerms = query.split(' ').filter(term => term !== ''); // Разделяем запрос на слова и убираем пустые строки

      let filteredResults = this.users; // Начинаем с полного списка пользователей

      for (const term of searchTerms) {
        filteredResults = filteredResults.filter(user => {
          const firstname = (user.firstname || '').toLowerCase();
          const lastname = (user.lastname || '').toLowerCase();
          const group = (user.group || '').toLowerCase();

          return (
            firstname.includes(term) ||
            lastname.includes(term) ||
            group.includes(term)
          );
        });
      }

      return filteredResults;
    },
  },
  methods: {
    async IsTeamowner() {
      const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
      if (!parsedSession) {
        console.error('Ошибка при получении информации о сессии:'. error);
        return;
      }
      if (parsedSession.roles.includes('teamowner')) {
        this.isTeamowner = true;
      } else {
        this.isTeamowner = false;
        const response = await api.getTeamAsMember(parsedSession.userId);

        console.log(response);

        if (response) {
          this.teams = [ response ];
          this.selectedTeam = response;
        }
      }
    },
    async sendInvitation() {
      const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
      if (!parsedSession) {
        console.error('Ошибка при получении информации о сессии:'. error);
        return;
      }

      console.log(this.selectedUser);

      const createInviteDto = new CreateInviteDto();

      createInviteDto.inviteeId = this.selectedUser.id;
      createInviteDto.teamId = this.selectedTeam.id;

      const response = await api.invite(parsedSession.id, createInviteDto);
      console.log(response);
      if (response=='OK') {
        this.showInviteCheck = false;
        this.showInviteOK = true;

        if (this.timerId) {
          clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
          this.showInviteOK = false;
          this.timerId = null;
        }, 2000);
        
      } else {
        this.showInviteERROR = true;
        if (this.timerId) {
          clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
          this.showInviteERROR = false;
          this.timerId = null;
        }, 2000);
        
      }
    },
    closeInviteCheck() {
      this.showInviteCheck = false;
    },
    selectUser(user) {
      this.selectedUser = user;
      this.showInviteCheck = true;
    },
    openInviteDialog(){
      this.showInviteDialog = true;
    },
    closeInviteDialog() {
      this.showInviteDialog = false;
    },
    isOwner(member, owner) {
      return member.firstname === owner.firstname && member.lastname === owner.lastname;
    },
    isLeader(member, leader) {
        if (!leader) return false;
      return member.firstname === leader.firstname && member.lastname === leader.lastname;
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
      const filteredMembers = members.filter(member => member.ownedTeams == null);
      return filteredMembers;
    },
    async loadUsers() {
      try {
        this.truncate = (str) => {
        if (!str) return '';
          return str.length > 50 ? str.substring(0, 50) + '...' : str;
        };

        const response = await api.getAll();
        console.log(response);
        this.users = response.filter(user => !user.team);
      } catch(error) {
        console.log(error);
        this.users = [];
      }
    },
    async loadTeams() { 
      try {
        if (this.isTeamowner == false) {
          return;
        }
        this.newTeam = new CreateTeamDto();

        const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
        if (!parsedSession) {
          console.error('Ошибка при получении информации о сессии:'. error);
        }
        const response = await api.getTeams(parsedSession.userId);     
        this.teams = response;
        console.error('Teams data:', this.teams);
      } catch (error) {
        console.error('Ошибка при загрузке объектов "Team":', error);
      }
    },
    async saveTeam() {
      const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
      if (!parsedSession) {
        console.error('Ошибка при получении информации о сессии:'. error);
      }

      const response = await api.create(parsedSession.userId, this.newTeam);

      if (!response) {
        console.error('Error: saveTeam(): не удалось создать команду:', error);
      }

      if (this.teams.length < 2){
        this.teams.push({name: this.newTeam.name, description: this.newTeam.description, members: []});
      }
      
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

.invite-ok-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(10, 235, 10, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 6;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-size: 16px;
}

.invite-ok-message.hidden {
  opacity: 0;
}

.invite-error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(233, 11, 11, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 7;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-size: 16px;
}

.invite-error-message.hidden {
  opacity: 0;
}

.invite-check-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.invite-check-content {
  text-align: center;
}

.invite-check-send-button {
  margin-top: 20px; /* Сохраняем верхний отступ */
  display: inline-block; /* Важно для применения margin между элементами */
  padding: 10px 20px; /* Добавляем внутренний отступ для текста */
  font-size: 16px; /* Размер текста */
  font-weight: bold; /* Жирный текст */
  color: white; /* Цвет текста */
  background-color: #4CAF50; /* Зеленый фон (пример) */
  border: none; /* Убираем рамку */
  border-radius: 5px; /* Скругляем углы */
  cursor: pointer; /* Меняем курсор на "руку" при наведении */
  transition: background-color 0.3s ease; /* Плавный переход цвета фона */
  margin-right: 10px; /* Добавляем отступ справа для разделения кнопок */
  text-decoration: none; /* Убираем подчеркивание (если это ссылка) */
}

.invite-check-send-button:hover {
  background-color: #367c39; /* Более темный зеленый при наведении */
}

.invite-check-deny-button {
  margin-top: 20px; /* Сохраняем верхний отступ */
  display: inline-block; /* Важно для применения margin между элементами */
  padding: 10px 20px; /* Добавляем внутренний отступ для текста */
  font-size: 16px; /* Размер текста */
  font-weight: bold; /* Жирный текст */
  color: white; /* Цвет текста */
  background-color:rgb(241, 6, 38); /* Зеленый фон (пример) */
  border: none; /* Убираем рамку */
  border-radius: 5px; /* Скругляем углы */
  cursor: pointer; /* Меняем курсор на "руку" при наведении */
  transition: background-color 0.3s ease; /* Плавный переход цвета фона */
  margin-right: 10px; /* Добавляем отступ справа для разделения кнопок */
  text-decoration: none; /* Убираем подчеркивание (если это ссылка) */
}

.invite-check-deny-button:hover {
  background-color:rgb(139, 4, 4); /* Более темный зеленый при наведении */
}

.invite-check-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4
}
.invite-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.invite-dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 700px;
  max-width: 80vw;
}

.user-block {
  padding: 10px;
  margin-bottom: 5px;
}

.user-info {
  margin-bottom: 5px;
  font-size: 14px;
}

.user-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-results {
  text-align: center;
}

.dialog-buttons {
  text-align: right;
  margin-top: 10px;
}

.team-invite-invite-button {
  background-color:rgb(106, 220, 53);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

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
  z-index: 2;
}

.team-details-notowner-modal {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-color: #dc3545; /* Красный цвет */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  margin-right: 10px;
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
  overflow: auto;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
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
  background-color: #ffc107; /* Желтый цвет */
  color: #212529; /* Темный цвет текста */
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  margin-top: 5px;
}

.team-details-leader-box {
  order: -1;
  background-color: #d0e9c6;
}

.team-details-leader-wrapper {
  width: 100%;
  display: flex;    
  justify-content: flex-start; 
  margin-bottom: 10px;
}

.team-details-team-description-wrapper {
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
}

.team-description-text {
  font-size: 16px;
  color: #495057;
  word-break: break-word;
  overflow-wrap: anywhere;
  overflow: auto;
}

.team-block {
  background-color: #fff; /* RGB(255, 255, 255) */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.team-name {
  color: #1f1c2e; /* RGB(31, 28, 46) */
}

.team-description {
  color: #4a4a4a; /*  A lighter shade of grey for the description  */
}

.team-members {
  margin-top: 16px;
}

.member-block {
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.member-firstname,
.member-lastname {
  color: #1f1c2e; /* RGB(31, 28, 46) */
  font-size: 14px;
  line-height: 1.2;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden;        /* Hide overflowing text */
  text-overflow: ellipsis;  /* Add ellipsis (...) */
}

.bg-grey-1 {
  background-color: #f3f6fd; /* RGB(243, 246, 253) */
}

.bg-grey-2 {
  background-color: #e0e3e9; /* A slightly lighter shade than #c1c4c9 */
}

.bg-grey-3 {
  background-color: #d0d3d9; /* A slightly darker shade than #c1c4c9 */
}

/* Стили для модальных окон */
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
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-width: 90%;
}

.create-team-modal {
  /* Дополнительные стили для модального окна создания команды */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  height: 200px;
  resize: vertical;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

/* Стили для панели управления командой */
.team-management-panel {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  text-align: left;
}

/* Стили для кнопки "Создать команду" */
.create-team-btn {
  background-color: blue; /* Синий цвет */
  color: white; /* Белый цвет текста (для контраста) */
  font-size: 1.2em; /* Увеличенный размер шрифта */
  padding: 10px 20px; /* Увеличиваем внутренние отступы, чтобы кнопка была больше */
  border: none; /* Убираем обводку */
  border-radius: 5px; /* Закругленные углы */
  cursor: pointer; /* Меняем курсор на "руку" при наведении */
}

.create-team-btn:hover {
  /* Добавляем эффект при наведении (опционально) */
  background-color: dodgerblue;
}
</style>