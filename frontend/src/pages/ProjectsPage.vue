<template>
  <div class="projects-page">
    <div class="projects-section">
      <div class="projects-section-header">
        <h1 class="projects-title">Биржа проектов</h1>
        <div class="header-actions">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Поиск по проектам..."
              class="search-input"
              @input="handleSearch"
            >
          </div>
          <button class="add-project-btn" @click="openAddProjectModal">
            Добавить проект
          </button>
        </div>
      </div>
      
      <div class="projects-container">
        <div class="projects-main-content">
          <div class="projects-filters">
            <div class="filter-buttons">
              <button class="active">Все</button>
            </div>
          </div>

          <div class="projects-status">
            <p>Всего проектов: {{ filteredProjects.length }}</p>
          </div>

          <div class="project-boxes jsGridView">
            <div 
              v-for="(project, index) in filteredProjects" 
              :key="project.id || index"
              class="project-box-wrapper"
              @click="openProjectDetails(project)"
            >
              <div class="project-box" :style="{ 'background-color': getProjectColor(index) }">
                <div class="project-box-header">
                  <span class="project-number">#{{ index + 1 }}</span>
                  <span class="project-status" :class="project.status">
                    {{ project.status === 'open' ? 'Открыт' : 'Закрыт' }}
                  </span>
                </div>
                <div class="project-box-content-header">
                  <p class="box-content-header">{{ project.title }}</p>
                  <p class="box-content-description">{{ project.description }}</p>
                </div>
                <div class="project-technologies">
                  <span 
                    v-for="(tech, techIndex) in project.technologies" 
                    :key="tech" 
                    class="tech-tag"
                    :style="{ 'background-color': getTechColor(techIndex) }"
                  >
                    {{ tech }}
                  </span>
                </div>
                <div class="project-meta-info">
                  <div class="project-initiator">
                    <strong>Инициатор:</strong> Екатерина Сердюкова
                  </div>
                  <div class="project-stats">
                    <span>Команда до 7 человек</span>
                    <span>Подано заявок: {{ index + 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="projects-sidebar">
          <div class="filter-section">
            <h3>Статус проекта</h3>
            <div class="filter-options">
              <label class="filter-option">
                <input 
                  type="checkbox" 
                  v-model="statusFilters.open"
                  @change="applyFilters"
                >
                <span>Набор открыт</span>
              </label>
              <label class="filter-option">
                <input 
                  type="checkbox" 
                  v-model="statusFilters.closed"
                  @change="applyFilters"
                >
                <span>Набор закрыт</span>
              </label>
            </div>
          </div>

          <div class="filter-section">
            <h3>Технологии</h3>
            <div class="filter-options tech-filters">
              <label 
                v-for="tech in allTechnologies" 
                :key="tech"
                class="filter-option"
              >
                <input 
                  type="checkbox" 
                  v-model="techFilters[tech]"
                  @change="applyFilters"
                >
                <span>{{ tech }}</span>
              </label>
            </div>
          </div>

          <button class="reset-filters" @click="resetFilters">
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>

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
          <div class="form-group">
            <label>Статус</label>
            <select v-model="newProject.status" required>
              <option value="open">Набор открыт</option>
              <option value="closed">Набор закрыт</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelAddProject">Отмена</button>
            <button type="submit">Создать проект</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="selectedProject" class="modal-overlay">
      <div class="modal-content project-details-modal">
        <div class="project-details-header">
          <h2>{{ selectedProject.title }}</h2>
          <button class="close-btn" @click="selectedProject = null">×</button>
        </div>
        
        <div class="project-details-content">
          <div class="project-info-section">
            <h3>Описание проекта</h3>
            <p class="project-description-text">{{ selectedProject.description }}</p>
          </div>
          
          <div class="project-tech-section">
            <h3>Технологии</h3>
            <div class="tech-tags-container">
              <span 
                v-for="(tech, techIndex) in selectedProject.technologies" 
                :key="tech"
                class="tech-tag-detail"
                :style="{ 'background-color': getTechColor(techIndex) }"
              >
                {{ tech }}
              </span>
            </div>
          </div>
          
          <div class="project-meta-section">
            <div class="meta-item">
              <span class="meta-label">Инициатор:</span>
              <span class="meta-value">Екатерина Сердюкова</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Статус:</span>
              <span class="meta-value">{{ selectedProject.status === 'open' ? 'Набор открыт' : 'Набор закрыт' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Команда:</span>
              <span class="meta-value">до 7 человек</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Заявки:</span>
              <span class="meta-value">{{ filteredProjects.findIndex(p => p.id === selectedProject.id) + 1 }}</span>
            </div>
          </div>
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
    const savedUserProjects = localStorage.getItem('userProjects');
    const userProjects = savedUserProjects ? JSON.parse(savedUserProjects) : [];

    const filteredUserProjects = userProjects.filter(project => 
      project.title && project.title.length > 3 && 
      project.description && project.description.length > 10
    );

    const defaultProjects = [
      {
        id: 1,
        title: 'Создание сайта для проведения конкурса "Педагог года"',
        description: 'Разработка веб-приложения для создания анкет преподавателей и проведения голосования за них',
        technologies: ['ASP.NET', 'SQLite'],
        isDefault: true,
        status: 'open'
      },
      {
        id: 2,
        title: 'Создание кабинета студента/преподавателя',
        description: 'Создание портала для учета посещаемости, оценок, расписания и других элементов учебного процесса',
        technologies: ['С#', 'PostgreSQL', 'Docker'],
        isDefault: true,
        status: 'open'
      },
      {
        id: 3,
        title: 'Веб приложение "Лига тенниса"',
        description: 'Многоплатформенное мобильное/веб приложение для организации теннисных турниров',
        technologies: ['React', 'Node.js', 'MySQL'],
        isDefault: true,
        status: 'closed'
      },
      {
        id: 4,
        title: 'Виртуальный консультант студента',
        description: 'Цифровой справочник и чат-бот для помощи студентам',
        technologies: ['Python', 'NLP', 'Docker'],
        isDefault: true,
        status: 'open'
      }
    ];

    const maxDefaultId = Math.max(...defaultProjects.map(p => p.id));
    const maxUserId = filteredUserProjects.length > 0 ? Math.max(...filteredUserProjects.map(p => p.id)) : 0;
    const nextId = Math.max(maxDefaultId, maxUserId) + 1;

    const allTechs = [...new Set([
      ...defaultProjects.flatMap(p => p.technologies),
      ...filteredUserProjects.flatMap(p => p.technologies),
      'С#', 'ASP.NET', 'SQLite', 'Git', 'Docker', 'PostgreSQL', 
      'SpringBoot', 'React', 'PHP', 'MySQL', 'Node.js', 'Python',
      'Java', 'Flutter', 'Firebase', 'Dart', 'NLP', 'Elasticsearch'
    ])].sort();

    const techFilters = {};
    allTechs.forEach(tech => {
      techFilters[tech] = false;
    });

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
        technologies: [],
        status: 'open'
      },
      projects: [...filteredUserProjects, ...defaultProjects],
      searchQuery: '',
      projectColors: [
        '#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5', '#E0F7FA', '#FFEBEE'
      ],
      techColors: [
        '#E53935', '#3949AB', '#00897B', '#F4511E', '#6A1B9A',
        '#1E88E5', '#43A047', '#FB8C00', '#7B1FA2', '#E53935',
        '#3949AB', '#00897B', '#F4511E', '#6A1B9A', '#1E88E5',
        '#43A047', '#FB8C00', '#7B1FA2'
      ],
      nextProjectId: nextId,
      statusFilters: {
        open: false,
        closed: false
      },
      techFilters: techFilters,
      allTechnologies: allTechs
    }
  },
  computed: {
    filteredProjects() {
      let result = this.projects;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
        );
      }
      
      const statusFiltersActive = this.statusFilters.open || this.statusFilters.closed;
      if (statusFiltersActive) {
        const selectedStatuses = [];
        if (this.statusFilters.open) selectedStatuses.push('open');
        if (this.statusFilters.closed) selectedStatuses.push('closed');
        
        result = result.filter(project => selectedStatuses.includes(project.status));
      }
      
      const selectedTechs = Object.keys(this.techFilters).filter(tech => this.techFilters[tech]);
      if (selectedTechs.length > 0) {
        result = result.filter(project => 
          selectedTechs.some(tech => project.technologies.includes(tech))
        );
      }
      
      return result;
    },
    totalProjects() {
      return this.projects.length;
    },
  },
  methods: {
    applyFilters() {
      // Фильтрация происходит автоматически через computed свойство
    },
    
    resetFilters() {
      this.statusFilters = {
        open: false,
        closed: false
      };
      
      for (const tech in this.techFilters) {
        this.techFilters[tech] = false;
      }
      
      this.searchQuery = '';
    },
    
    saveUserProjects() {
      const userProjects = this.projects.filter(p => !p.isDefault);
      localStorage.setItem('userProjects', JSON.stringify(userProjects));
    },
    
    handleSearch() {
      // Поиск работает через computed свойство
    },
    
    getProjectColor(index) {
      return this.projectColors[index % this.projectColors.length];
    },
    
    getTechColor(index) {
      return this.techColors[index % this.techColors.length];
    },
    
    openAddProjectModal() {
      this.showAddProjectModal = true;
    },
    
    cancelAddProject() {
      this.resetNewProject();
      this.showAddProjectModal = false;
    },
    
    openProjectDetails(project) {
      this.selectedProject = project;
    },
    
    async submitProject() {
      const projectData = {
        id: this.nextProjectId++,
        title: this.newProject.title, 
        description: this.newProject.description,
        technologies: this.getRandomTechnologies(),
        status: this.newProject.status
      };

      try {
        // Всегда сохраняем в localStorage
        this.projects.unshift(projectData);
        this.saveUserProjects();
        this.resetNewProject();
        this.showAddProjectModal = false;
        
        // Если не в режиме разработки, также отправляем на сервер
        if (process.env.NODE_ENV !== 'development') {
          const response = await this.CreateProject(projectData);
          if (response) {
            // Обновляем проект данными с сервера
            const index = this.projects.findIndex(p => p.id === projectData.id);
            if (index !== -1) {
              this.projects[index] = {
                id: response.id || projectData.id,
                title: response.title || projectData.title,
                description: response.description || projectData.description,
                technologies: response.technologies || projectData.technologies,
                status: response.status || projectData.status
              };
              this.saveUserProjects();
            }
          }
        }
      } catch(error) {
        console.error('Ошибка при создании проекта:', error);
      }
    },
    
    getRandomTechnologies() {
      const allTechnologies = ['С#', 'ASP.NET', 'SQLite', 'Git', 'Docker', 'PostgreSQL', 
                              'SpringBoot', 'React', 'PHP', 'MySQL', 'Node.js', 'Python',
                              'Java', 'Flutter', 'Firebase', 'Dart', 'NLP', 'Elasticsearch'];
      const count = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...allTechnologies].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    
    async CreateProject(projectData) {
      try {
        const response = await api.create(projectData);
        return response.data;
      } catch(error) {
        console.error('Ошибка при создании проекта (API):', error);
        return null;
      }
    },
    
    resetNewProject() {
      this.newProject = {
        title: '',
        description: '',
        technologies: [],
        status: 'open'
      };
    }
  },
  mounted() {
    const savedProjects = localStorage.getItem('userProjects');
    if (savedProjects) {
      const userProjects = JSON.parse(savedProjects);
      // Объединяем с дефолтными проектами, сохраняя порядок (новые сверху)
      this.projects = [...userProjects, ...this.projects.filter(p => p.isDefault)];
    }
  }
};
</script>

<style scoped>
.projects-page {
  padding: 20px;
  height: 100%;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

.projects-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.projects-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.projects-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  width: 250px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.add-project-btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #3498db;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-project-btn:hover {
  background-color: #2980b9;
}

.projects-container {
  display: flex;
  gap: 20px;
}

.projects-main-content {
  flex: 1;
  min-width: 0;
}

.projects-sidebar {
  width: 220px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.projects-filters {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-buttons button.active {
  color: #3498db;
  border-bottom: 2px solid #3498db;
}

.projects-status {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.project-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 0 -7px;
}

.project-box-wrapper {
  padding: 7px;
  transition: all 0.3s;
  width: calc(50% - 14px);
  flex-grow: 0;
  cursor: pointer;
}

.project-box {
  border-radius: 12px;
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.project-box:hover {
  transform: translateY(-5px);
}

.project-box-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.project-number {
  font-size: 14px;
  font-weight: 700;
  color: #555;
}

.project-status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 10px;
}

.project-status.open {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.project-status.closed {
  background-color: #ffebee;
  color: #c62828;
}

.box-content-header {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2c3e50;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.box-content-description {
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 12px;
  color: #555;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tech-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.project-meta-info {
  margin-top: auto;
}

.project-initiator {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.project-stats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  flex-wrap: wrap;
}

.filter-section {
  margin-bottom: 18px;
}

.filter-section h3 {
  font-size: 15px;
  color: #2c3e50;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tech-filters {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 3px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}

.filter-option input {
  cursor: pointer;
}

.reset-filters {
  width: 100%;
  padding: 7px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s;
}

.reset-filters:hover {
  background-color: #d0d0d0;
}

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
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  font-size: 14px;
}

.form-group textarea {
  min-height: 90px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

.form-actions button {
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
}

.form-actions button:first-child {
  background-color: #e0e0e0;
  color: #333;
}

.form-actions button:first-child:hover {
  background-color: #d0d0d0;
}

.form-actions button:last-child {
  background-color: #3498db;
  color: white;
}

.form-actions button:last-child:hover {
  background-color: #2980b9;
}

.project-details-modal {
  max-width: 700px;
  padding: 25px;
  position: relative;
}

.project-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.project-details-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 22px;
  word-wrap: break-word;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 24px;
  line-height: 1;
  padding: 4px;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.project-details-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-info-section h3,
.project-tech-section h3 {
  color: #2c3e50;
  font-size: 17px;
  margin-top: 0;
  margin-bottom: 12px;
}

.project-description-text {
  color: #555;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.tech-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag-detail {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.project-meta-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.meta-item {
  display: flex;
  gap: 8px;
}

.meta-label {
  font-weight: 600;
  color: #555;
  min-width: 90px;
  font-size: 14px;
}

.meta-value {
  color: #333;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .projects-container {
    flex-direction: column;
  }
  
  .projects-sidebar {
    width: 100%;
    order: -1;
    margin-bottom: 20px;
  }
  
  .project-box-wrapper {
    width: calc(50% - 14px) !important;
  }
}

@media (max-width: 768px) {
  .project-box-wrapper {
    width: 100% !important;
  }
  
  .projects-section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .add-project-btn {
    width: 100%;
    text-align: center;
  }
  
  .project-details-modal {
    width: 90%;
    padding: 18px;
  }
}
</style>