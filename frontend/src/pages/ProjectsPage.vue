<template>
  <div class="projects-page">
    <div class="projects-section">
      <div class="projects-section-header">
        <p>Проекты</p>
        <div class="header-actions">
          <div class="filters">
            <button 
              v-for="filter in filters" 
              :key="filter.value"
              @click="setFilter(filter.value)"
              :class="{ 'active': activeFilter === filter.value }"
            >
              {{ filter.label }}
            </button>
          </div>
          <button class="add-project-btn" @click="openAddProjectModal">
            Добавить проект
          </button>
        </div>
      </div>
      
      
      <div class="projects-section-line">
        <div class="projects-status">
          <div class="item-status">
            
            <p v-if="projects">Всего проектов: {{ totalProjects }}</p>
            <p v-else>Загрузка...</p>
          </div>
        </div>
        <div class="view-actions">
          <button class="view-btn list-view" :class="{ 'active': viewMode === 'list' }" @click="viewMode = 'list'" title="Список">
          </button>
          <button class="view-btn grid-view" :class="{ 'active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="Сетка">
          </button>
        </div>
      </div>

      <div class="project-boxes" :class="{ 'jsGridView': viewMode === 'grid', 'jsListView': viewMode === 'list' }">
        <div 
          v-for="project in projects" 
          :key="project.title"
          class="project-box-wrapper"
          :style="{ width: viewMode === 'grid' ? '33.3%' : '100%' }"
        >
          <div class="project-box" :style="{ 'background-color': 'lightblue' }">
            <div class="project-box-header">
              <div class="more-wrapper">
                <button class="project-btn-more">
                </button>
              </div>
            </div>
            <div class="project-box-content-header">
              <p class="box-content-header">{{ project.title }}</p>
              <p class="box-content-description">{{ project.description }}</p>
            </div>
            <div class="project-box-footer">
              <div class="project-actions">
                <button 
                  class="details-btn"
                  @click="openProjectDetails(project)"
                  :style="{ color: 'darkgreen' }"
                >
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления проекта -->
    <div v-if="showAddProjectModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Добавить новый проект</h3>
        <form @submit.prevent="submitProject">
          <div class="form-group">
            <label>Название проекта</label>
            <input v-model="newProject.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newProject.description" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddProjectModal = false">Отмена</button>
            <button type="submit">Создать проект</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно деталей проекта -->
    <div v-if="selectedProject" class="modal-overlay">
      <div class="modal-content project-details">
        <button class="close-btn" @click="selectedProject = null">
        X
        </button>
        <h3>{{ selectedProject.title }}</h3>
        <div class="project-description">
          <h4>Описание проекта</h4>
          <p>{{ selectedProject.description }}</p>
        </div>
        <div class="project-actions">
          <button class="edit-btn">Редактировать</button>
          <button class="delete-btn">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import * as api from '../api/projects.api';

export default {
  name: 'ProjectsPage',
  data() {
    return {
      viewMode: 'grid',
      activeFilter: 'all',
      filters: [
        { value: 'all', label: 'Все проекты' },
      ],
      showAddProjectModal: false,
      selectedProject: null,
      newProject: {
        title: '',
        description: '',
      },
      projects: null,
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeFilter === 'all') return this.projects
      return this.projects.filter(p => p.title === this.activeFilter)
    },
    totalProjects() {
      return this.projects.length
    },
  },

  async mounted() {
    await this.loadProjects();

  },

  methods: {
    setFilter(filter) {
      this.activeFilter = filter
    },
    getStatusText(status) {
      const texts = {
        in_progress: 'В работе',
        pending: 'На утверждении',
        completed: 'Завершен'
      }
      return texts[status] || 'Неизвестно';
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('ru-RU', options)
    },
    openAddProjectModal() {
      this.showAddProjectModal = true
    },
    async submitProject() {
      const projectData = {title: this.newProject.title, description: this.newProject.description};

      try {
        this.showAddProjectModal = false;
        const response = await this.CreateProject(projectData);
        if (response) {
          newProject = {title: response.title, description: response.description};
          this.projects.push(newProject);
          this.showAddProjectModal = false;
          this.resetNewProject();
        }
      }  catch(error) {console.error('Ошибка при создании "Проект":',error)};
    },
    async CreateProject(projectData){

      try {

        const response = await api.create(projectData);
        return response.data;

      } catch(error) {

        console.error('Ошибка при создании "Проект" (API):',error);

      }

    },
    resetNewProject() {
      this.newProject = {
        title: '',
        description: '',
      };
    },
    openProjectDetails(project) {
      this.selectedProject = project
    },
    async loadProjects() {

      try {
        const response = await api.getAll();     
	this.projects = response;
        console.log('Projects data:', this.projects);
      } catch (error) {
        console.error('Ошибка при загрузке объектов "Проект":', error);

      }

    }
  }
};
</script>

<style scoped>
.projects-page {
  padding: 20px;
  height: 100%;
}

.projects-section {
  background-color: var(--projects-section);
  border-radius: 32px;
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.projects-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.projects-section-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  opacity: .9;
  margin: 0;
  color: var(--main-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters {
  display: flex;
  gap: 8px;
}

.filters button {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: var(--search-area-bg);
  color: var(--secondary-color);
  cursor: pointer;
  transition: all 0.3s;
}

.filters button.active {
  background-color: var(--link-color-active-bg);
  color: var(--link-color-active);
}

.add-project-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  background-color: var(--button-bg);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.add-project-btn:hover {
  opacity: 0.9;
}

.projects-section-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
}

.projects-status {
  display: flex;
  gap: 20px;
}

.item-status {
  display: flex;
  flex-direction: column;
}

.status-number {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  color: var(--main-color);
}

.status-type {
  color: var(--secondary-color);
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  color: var(--main-color);
  transition: .2s;
}

.view-btn.active {
  background-color: var(--link-color-active-bg);
  color: var(--link-color-active);
}

.project-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 -8px;
  overflow-y: auto;
}

.project-box-wrapper {
  padding: 8px;
  transition: .2s;
}

.project-box {
  border-radius: 30px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--main-color);
}

.project-box-header span {
  color: #4A4A4A;
  opacity: .7;
  font-size: 14px;
  line-height: 16px;
}

.project-btn-more {
  padding: 0;
  height: 24px;
  width: 24px;
  position: relative;
  background-color: transparent;
  border: none;
}

.box-content-header {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  opacity: .7;
  margin-bottom: 8px;
}

.box-content-subheader {
  font-size: 14px;
  line-height: 24px;
  opacity: .7;
  margin-bottom: 8px;
}

.box-content-description {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 16px;
  color: var(--secondary-color);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.box-progress-wrapper {
  margin-bottom: 16px;
}

.box-progress-header {
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  margin: 0 0 8px 0;
}

.box-progress-bar {
  width: 100%;
  height: 4px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 8px;
}

.box-progress {
  display: block;
  height: 4px;
  border-radius: 6px;
}

.box-progress-percentage {
  text-align: right;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
}

.project-box-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: auto;
}

.participants {
  display: flex;
  align-items: center;
}

.participants img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: -8px;
  border: 2px solid white;
}

.participants img:first-child {
  margin-right: 0;
}

.add-participant {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255,255,255,0.6);
  margin-left: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  font-size: 12px;
  font-weight: bold;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.details-btn:hover {
  background-color: rgba(0,0,0,0.05);
}

.days-left {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.6);
}

/* Стили для списка */
.jsListView .project-box {
  flex-direction: row;
  align-items: center;
}

.jsListView .project-box-content-header {
  flex: 1;
  margin-right: 20px;
}

.jsListView .box-progress-wrapper {
  width: 200px;
}

.jsListView .project-box-footer {
  margin-left: auto;
  flex-direction: column;
  align-items: flex-end;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--projects-section);
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  color: var(--main-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--main-color);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--message-box-border);
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.form-group textarea {
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.form-actions button:first-child {
  background-color: var(--message-box-border);
  color: var(--main-color);
}

.form-actions button:last-child {
  background-color: var(--button-bg);
  color: white;
}

/* Детали проекта */
.project-details {
  position: relative;
  max-width: 800px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--main-color);
}

.project-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.project-status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  color: white;
}

.project-course,
.project-date {
  font-size: 14px;
  color: var(--secondary-color);
}

.project-description {
  margin-bottom: 20px;
}

.project-description h4 {
  margin-bottom: 10px;
  color: var(--main-color);
}

.project-progress {
  margin-bottom: 20px;
}

.project-progress h4 {
  margin-bottom: 10px;
  color: var(--main-color);
}

.progress-bar {
  height: 10px;
  background-color: var(--message-box-border);
  border-radius: 5px;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
}

.progress-value {
  font-size: 14px;
  color: var(--secondary-color);
}

.project-team h4 {
  margin-bottom: 10px;
  color: var(--main-color);
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-member img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.project-actions button {
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: var(--button-bg);
  color: white;
}

.delete-btn {
  background-color: #ff4757;
  color: white;
}
</style>