<template>
  <div>
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
    <div v-if="selectedTeam" class="team-details-modal">
      <div class="team-details-modal-content">
        <button @click="closeTeamDetails" class="team-details-close-button">Закрыть</button>

        <div class="team-details-team-info-container">
          <h3 class="team-details-team-name-header">{{ selectedTeam.name }}</h3>
          <p class="team-details-team-description-text">{{ selectedTeam.description }}</p>
        </div>

        <div class="team-details-members-container">
          <div class="team-details-leader-wrapper">
            <div v-if="leader" class="team-details-member-box leader-box">
              <div class="team-details-member-firstname">{{ leader.firstname }}</div>
              <div class="team-details-member-lastname">{{ leader.lastname }}</div>
              <div class="team-details-leader-label">Тимлидер</div>
            </div>
          </div>

          <div v-for="(member, index) in filteredMembersWithoutLeader" :key="index" class="team-details-member-box">
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

export default defineComponent({
  name: 'TeamsPage',
  data() {
    return {
      teams: null,
      showCreateTeamModal: false,
      newTeam: null,
      selectedTeam: null,
    };
  },
  async mounted() {
    await this.loadTeams();

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
  },
  methods: {
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
      const filteredMembers = members.slice(1);
      return filteredMembers.slice(0, 7);
    },
    async loadTeams() { 
      try {
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
  background-color: #dc3545; /* Красный цвет */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
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