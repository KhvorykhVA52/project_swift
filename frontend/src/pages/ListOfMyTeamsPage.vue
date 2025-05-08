<template>
  <div class="teams-container">
    <!-- Заголовок и кнопка создания команды -->
    <div class="teams-header">
      <h2 class="teams-title">Мои команды</h2>
      <button class="create-team-btn" @click="showCreateTeamModal = true">
        Создать команду
      </button>
    </div>

    <!-- Основной контент с сеткой команд и фильтрами -->
    <div class="teams-content">
      <!-- Блок с командами -->
      <div class="teams-grid-container">
        <div class="teams-grid">
          <div 
            v-for="(team, index) in filteredTeams" 
            :key="index" 
            class="team-card"
            :class="{ 'leader-team': isLeader(currentUser, team.leader) }"
            @click="openTeamDetails(team)"
          >
            <div class="team-card-header">
              <div class="team-name">{{ team.name }}</div>
              <div v-if="isLeader(currentUser, team.leader)" class="team-leader-badge">Лидер</div>
            </div>
            <div class="team-description">{{ truncatedDescription(team.description, 80) }}</div>
            
            <div class="tech-stack">
              <div 
                class="tech-tag" 
                v-for="(tech, techIndex) in team.techStack" 
                :key="techIndex"
                :style="{ backgroundColor: getTechColor(tech) }"
              >
                {{ tech }}
              </div>
            </div>
            
            <div class="team-meta">
              <div class="team-meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/>
                  <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>{{ team.members.length }} участников</span>
              </div>
              <div class="team-meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>До {{ team.deadline }}</span>
              </div>
            </div>
            
            <div class="team-members">
              <div 
                v-for="(member, memberIndex) in limitedMembers(team.members)" 
                :key="memberIndex" 
                class="member-avatar"
                :style="{ backgroundColor: getMemberColor(member) }"
              >
                {{ getMemberInitials(member) }}
              </div>
              <div v-if="team.members.length > 5" class="more-members">+{{ team.members.length - 5 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Блок фильтров (теперь справа) -->
      <div class="filters-sidebar">
        <div class="filters-container">
          <div class="teams-filters">
            <div class="filter-section">
              <h3 class="filter-title">Фильтры</h3>
              
              <div class="filter-group">
                <label class="filter-label">Поиск по названию</label>
                <input 
                  type="text" 
                  class="filter-input" 
                  v-model="filters.searchQuery" 
                  placeholder="Введите название"
                >
              </div>

              <div class="filter-group">
                <label class="filter-label">Статус</label>
                <select class="filter-select" v-model="filters.status">
                  <option value="all">Все команды</option>
                  <option value="leader">Я лидер</option>
                  <option value="member">Я участник</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Технологии</label>
                <div class="tech-filter-tags">
                  <span 
                    class="tech-filter-tag"
                    v-for="tech in allTechnologies"
                    :key="tech"
                    :class="{ active: filters.selectedTechs.includes(tech) }"
                    @click="toggleTechFilter(tech)"
                    :style="{ backgroundColor: getTechColor(tech) }"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <button class="reset-filters-btn" @click="resetFilters">
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно информации о команде -->
    <div v-if="selectedTeam" class="modal-overlay" @click.self="closeTeamDetails">
      <div class="modal-content team-details-modal">
        <div class="modal-header">
          <h3>{{ selectedTeam.name }}</h3>
          <button class="close-btn" @click="closeTeamDetails">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="team-info-section">
            <h4>Описание проекта</h4>
            <p class="team-description">{{ selectedTeam.description || 'Нет описания' }}</p>
          </div>
          
          <div class="team-info-section">
            <h4>Стек технологий</h4>
            <div class="tech-stack">
              <div 
                class="tech-tag" 
                v-for="(tech, techIndex) in selectedTeam.techStack" 
                :key="techIndex"
                :style="{ backgroundColor: getTechColor(tech) }"
              >
                {{ tech }}
              </div>
            </div>
          </div>
          
          <div class="team-info-section">
            <h4>Участники</h4>
            <div class="members-list">
              <div v-if="leader" class="member-item leader">
                <div class="member-avatar" :style="{ backgroundColor: getMemberColor(leader) }">
                  {{ getMemberInitials(leader) }}
                </div>
                <div class="member-info">
                  <div class="member-name">{{ leader.firstname }} {{ leader.lastname }}</div>
                  <div class="member-role">Лидер</div>
                </div>
              </div>
              
              <div 
                v-for="(member, index) in filteredMembersWithoutLeader" 
                :key="index" 
                class="member-item"
              >
                <div class="member-avatar" :style="{ backgroundColor: getMemberColor(member) }">
                  {{ getMemberInitials(member) }}
                </div>
                <div class="member-info">
                  <div class="member-name">{{ member.firstname }} {{ member.lastname }}</div>
                  <div class="member-role">Участник</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button v-if="isCurrentUserLeader" class="delete-btn" @click="confirmDeleteTeam">
            Удалить команду
          </button>
          <button class="close-btn-secondary" @click="closeTeamDetails">
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания команды -->
    <div v-if="showCreateTeamModal" class="modal-overlay" @click.self="showCreateTeamModal = false">
      <div class="modal-content create-team-modal">
        <div class="modal-header">
          <h3>Создать команду</h3>
          <button class="close-btn" @click="showCreateTeamModal = false">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="teamName">Название команды *</label>
            <input 
              type="text" 
              id="teamName" 
              v-model="newTeam.name" 
              placeholder="Введите название команды"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="teamDescription">Описание команды</label>
            <textarea 
              id="teamDescription" 
              v-model="newTeam.description" 
              placeholder="Добавьте описание команды"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="teamDeadline">Дата окончания проекта *</label>
            <input 
              type="text" 
              id="teamDeadline"
              v-model="newTeam.deadline" 
              placeholder="ДД.ММ.ГГГГ"
              required
            />
          </div>

          <div class="form-group">
            <label>Стек технологий (через запятую)</label>
            <input 
              type="text" 
              v-model="newTeam.techStackInput" 
              placeholder="Vue, TypeScript, Node.js"
            />
          </div>

          <div class="form-group">
            <label>Участники команды</label>
            <div class="members-input-container">
              <div v-for="(member, index) in newTeam.members" :key="index" class="member-input-row">
                <input
                  type="text"
                  v-model="member.fullname"
                  placeholder="Фамилия Имя"
                  class="member-input"
                />
                <select v-model="member.role" class="role-select">
                  <option value="member">Участник</option>
                  <option value="leader">Лидер</option>
                </select>
                <button @click="removeMember(index)" class="remove-member-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <button @click="addMember" class="add-member-btn">
                + Добавить участника
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="save-btn" @click="saveTeam">
            Создать
          </button>
          <button class="cancel-btn" @click="showCreateTeamModal = false">
            Отмена
          </button>
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
      teams: [
        {
          id: 1,
          name: 'Портал для университета',
          description: 'Создание кабинета студента/преподавателя для учета посещаемости, оценок и расписания.',
          members: [
            { firstname: 'Иван', lastname: 'Иванов' },
            { firstname: 'Петр', lastname: 'Петров' },
            { firstname: 'Сергей', lastname: 'Сергеев' },
          ],
          leader: { firstname: 'Иван', lastname: 'Иванов' },
          owner: { firstname: 'Иван', lastname: 'Иванов' },
          techStack: ['Vue', 'TypeScript', 'Quasar', 'Node.js', 'PostgreSQL'],
          deadline: '15.06.2026'
        },
        {
          id: 2,
          name: 'Мобильное приложение',
          description: 'Разработка кроссплатформенного мобильного приложения для заказа еды.',
          members: [
            { firstname: 'Иван', lastname: 'Иванов' },
            { firstname: 'Алексей', lastname: 'Алексеев' },
          ],
          leader: { firstname: 'Алексей', lastname: 'Алексеев' },
          owner: { firstname: 'Алексей', lastname: 'Алексеев' },
          techStack: ['Flutter', 'Dart', 'Firebase'],
          deadline: '30.11.2026'
        },
        {
          id: 3,
          name: 'Аналитика данных',
          description: 'Проект по анализу больших данных для образовательных целей.',
          members: [
            { firstname: 'Иван', lastname: 'Иванов' },
            { firstname: 'Мария', lastname: 'Петрова' },
            { firstname: 'Дмитрий', lastname: 'Сидоров' },
          ],
          leader: { firstname: 'Иван', lastname: 'Иванов' },
          owner: { firstname: 'Иван', lastname: 'Иванов' },
          techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
          deadline: '20.09.2026'
        },
        {
          id: 4,
          name: 'Веб-портал',
          description: 'Разработка корпоративного веб-портала для внутреннего использования.',
          members: [
            { firstname: 'Иван', lastname: 'Иванов' },
            { firstname: 'Елена', lastname: 'Иванова' },
            { firstname: 'Андрей', lastname: 'Смирнов' },
          ],
          leader: { firstname: 'Елена', lastname: 'Иванова' },
          owner: { firstname: 'Елена', lastname: 'Иванова' },
          techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
          deadline: '10.12.2026'
        }
      ],
      filters: {
        searchQuery: '',
        status: 'all',
        selectedTechs: []
      },
      showCreateTeamModal: false,
      newTeam: {
        name: '',
        description: '',
        deadline: '',
        techStackInput: '',
        members: [
          {
            fullname: '',
            role: 'member'
          }
        ]
      },
      selectedTeam: null,
      currentUser: { firstname: 'Иван', lastname: 'Иванов' },
      allTechnologies: ['Vue', 'TypeScript', 'Node.js', 'PostgreSQL', 'Flutter', 'Dart', 'Python', 'React']
    };
  },
  computed: {
    leader() {
      return this.selectedTeam ? this.selectedTeam.leader : null;
    },
    filteredMembersWithoutLeader() {
      if (!this.selectedTeam) return [];
      return this.selectedTeam.members.filter(member => 
        !this.isLeader(member, this.selectedTeam.leader))
    },
    isCurrentUserLeader() {
      if (!this.selectedTeam) return false;
      return this.isLeader(this.currentUser, this.selectedTeam.leader);
    },
    filteredTeams() {
      return this.teams.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(
          this.filters.searchQuery.toLowerCase()
        );
        
        const matchesStatus = 
          this.filters.status === 'all' ||
          (this.filters.status === 'leader' && this.isLeader(this.currentUser, team.leader)) ||
          (this.filters.status === 'member' && !this.isLeader(this.currentUser, team.leader));
        
        const matchesTech = this.filters.selectedTechs.length === 0 || 
          this.filters.selectedTechs.some(tech => team.techStack.includes(tech));
        
        return matchesSearch && matchesStatus && matchesTech;
      }).sort((a, b) => {
        const aIsLeader = this.isLeader(this.currentUser, a.leader);
        const bIsLeader = this.isLeader(this.currentUser, b.leader);
        return bIsLeader - aIsLeader;
      });
    }
  },
  async mounted() {
    await this.loadTeams();
    this.newTeam = {
      ...new CreateTeamDto(),
      techStackInput: '',
      members: [
        {
          fullname: '',
          role: 'member'
        }
      ]
    };
  },
  methods: {
    getTechColor(tech) {
      const colors = {
        'Vue': '#42b983',
        'TypeScript': '#3178c6',
        'Quasar': '#1976d2',
        'Node.js': '#68a063',
        'PostgreSQL': '#336791',
        'Flutter': '#02569b',
        'Dart': '#00b4ab',
        'Firebase': '#ffca28',
        'Python': '#3776ab',
        'Pandas': '#150458',
        'NumPy': '#4d77cf',
        'Matplotlib': '#11557c',
        'React': '#61dafb',
        'MongoDB': '#47a248'
      };
      return colors[tech] || '#666';
    },
    getMemberInitials(member) {
      if (!member) return '';
      return (member.firstname.charAt(0) + (member.lastname ? member.lastname.charAt(0) : ''));
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
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    limitedMembers(members) {
      if (!Array.isArray(members)) return [];
      return members.slice(0, 5);
    },
    getMemberColor(member) {
      if (!member) return '#ccc';
      const colors = ['#186EFF', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4'];
      const hash = member.firstname.length + (member.lastname ? member.lastname.length : 0);
      return colors[hash % colors.length];
    },
    toggleTechFilter(tech) {
      const index = this.filters.selectedTechs.indexOf(tech);
      if (index === -1) {
        this.filters.selectedTechs.push(tech);
      } else {
        this.filters.selectedTechs.splice(index, 1);
      }
    },
    resetFilters() {
      this.filters = {
        searchQuery: '',
        status: 'all',
        selectedTechs: []
      };
    },
    async loadTeams() {
      try {
        const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
        if (!parsedSession) {
          console.error('Ошибка при получении информации о сессии');
          return;
        }
        const response = await api.getTeams(parsedSession.userId);
        if (response) {
          this.teams = response.map(team => ({
            ...team,
            techStack: team.techStack || [],
            deadline: team.deadline || '31.12.2026'
          }));
        }
      } catch (error) {
        console.error('Ошибка при загрузке команд:', error);
      }
    },
    addMember() {
      this.newTeam.members.push({
        fullname: '',
        role: 'member'
      });
    },
    removeMember(index) {
      this.newTeam.members.splice(index, 1);
    },
    parseMember(fullname) {
      const parts = fullname.trim().split(' ');
      return {
        firstname: parts[1] || '',
        lastname: parts[0] || ''
      };
    },
    async saveTeam() {
      try {
        // Валидация обязательных полей
        if (!this.newTeam.name || !this.newTeam.deadline) {
          alert('Пожалуйста, заполните все обязательные поля');
          return;
        }

        // Парсим участников
        const members = this.newTeam.members
          .filter(m => m.fullname.trim())
          .map(m => {
            const member = this.parseMember(m.fullname);
            return {
              ...member,
              role: m.role
            };
          });

        if (members.length === 0) {
          alert('Добавьте хотя бы одного участника');
          return;
        }

        // Находим лидера (если не указан, берем первого участника)
        const leader = members.find(m => m.role === 'leader') || members[0];
        leader.role = 'leader'; // Гарантируем что у лидера правильная роль

        // Формируем данные команды
        const teamData = {
          name: this.newTeam.name,
          description: this.newTeam.description,
          deadline: this.newTeam.deadline,
          techStack: this.newTeam.techStackInput.split(',').map(item => item.trim()).filter(item => item),
          members: members.map(m => ({ firstname: m.firstname, lastname: m.lastname })),
          leader: { firstname: leader.firstname, lastname: leader.lastname }
        };

        // Сохранение через API
        const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
        if (!parsedSession) {
          console.error('Ошибка при получении информации о сессии');
          return;
        }

        const response = await api.create(parsedSession.userId, teamData);
        if (response) {
          this.teams.push({
            ...response,
            techStack: teamData.techStack,
            deadline: teamData.deadline,
            members: teamData.members,
            leader: teamData.leader
          });

          // Закрываем модальное окно и сбрасываем форму
          this.showCreateTeamModal = false;
          this.newTeam = {
            name: '',
            description: '',
            deadline: '',
            techStackInput: '',
            members: [
              {
                fullname: '',
                role: 'member'
              }
            ]
          };
        }
      } catch (error) {
        console.error('Ошибка при создании команды:', error);
      }
    },
    async confirmDeleteTeam() {
      if (confirm('Вы уверены, что хотите удалить эту команду?')) {
        await this.deleteTeam();
      }
    },
    async deleteTeam() {
      if (!this.selectedTeam || !this.isCurrentUserLeader) return;
      
      try {
        const parsedSession = JSON.parse(localStorage.getItem('ttm-session'));
        if (!parsedSession) {
          console.error('Ошибка при получении информации о сессии');
          return;
        }
        
        const response = await api.deleteTeam(parsedSession.userId, this.selectedTeam.id);
        if (response) {
          this.teams = this.teams.filter(team => team.id !== this.selectedTeam.id);
          this.selectedTeam = null;
        }
      } catch (error) {
        console.error('Ошибка при удалении команды:', error);
      }
    }
  }
});
</script>

<style scoped>
.teams-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.teams-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.teams-content {
  display: flex;
  gap: 24px;
}

.teams-grid-container {
  flex: 1;
}

.filters-sidebar {
  width: 280px;
}

.filters-container {
  background-color: var(--projects-section);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

.teams-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--main-color);
}

.create-team-btn {
  background-color: #186EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-team-btn:hover {
  background-color: #1359D2;
}

.teams-filters {
  width: 100%;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--main-color);
  margin-bottom: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--secondary-color);
  font-weight: 500;
}

.filter-input, .filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--message-box-border);
  border-radius: 6px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.tech-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-filter-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.tech-filter-tag.active {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reset-filters-btn {
  width: 100%;
  padding: 10px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.reset-filters-btn:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.dark .reset-filters-btn {
  background-color: #5c636a;
}

.dark .reset-filters-btn:hover {
  background-color: #4e555b;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.team-card {
  background-color: var(--projects-section);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--main-color);
}

.team-leader-badge {
  background-color: #4CAF50;
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
}

.team-description {
  font-size: 14px;
  color: var(--secondary-color);
  margin-bottom: 12px;
  line-height: 1.4;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.tech-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.team-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--secondary-color);
}

.team-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-meta-item svg {
  color: var(--secondary-color);
}

.team-members {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.more-members {
  font-size: 12px;
  color: var(--secondary-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--projects-section);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--message-box-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary-color);
  padding: 4px;
}

.close-btn:hover {
  color: var(--main-color);
}

.modal-body {
  padding: 16px;
}

.team-info-section {
  margin-bottom: 20px;
}

.team-info-section h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
}

.team-description {
  color: var(--secondary-color);
  line-height: 1.5;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-item.leader {
  background-color: rgba(76, 175, 80, 0.1);
  padding: 8px;
  border-radius: 6px;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--main-color);
}

.member-role {
  font-size: 12px;
  color: var(--secondary-color);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--message-box-border);
  gap: 10px;
}

.delete-btn {
  background-color: #FF5252;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: auto;
}

.delete-btn:hover {
  background-color: #E53935;
}

.close-btn-secondary {
  background-color: #186EFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn-secondary:hover {
  background-color: #1359D2;
}

.save-btn {
  background-color: #186EFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #1359D2;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.dark .cancel-btn {
  background-color: #424242;
  color: #fff;
}

.dark .cancel-btn:hover {
  background-color: #616161;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--main-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--message-box-border);
  border-radius: 6px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Новые стили для формы создания команды */
.members-input-container {
  margin-top: 10px;
}

.member-input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.member-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--message-box-border);
  border-radius: 6px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.role-select {
  width: 120px;
  padding: 8px 12px;
  border: 1px solid var(--message-box-border);
  border-radius: 6px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.remove-member-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary-color);
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-member-btn:hover {
  color: var(--main-color);
}

.add-member-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 5px;
}

.add-member-btn:hover {
  background-color: #e0e0e0;
}

.dark .add-member-btn {
  background-color: #424242;
  color: #fff;
}

.dark .add-member-btn:hover {
  background-color: #616161;
}
</style>