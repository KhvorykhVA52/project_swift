<template>
  <div class="profile-container" :class="{'admin-profile': isAdmin}">
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar" :style="avatarStyle">
          <img
            v-if="user.avatarUrl"
            :src="`http://localhost:3000/users/me/getavatar/${user.avatarUrl}`"
            alt="Аватар"
            class="avatar-image"
            @error="handleImageError"
            ref="avatarImage"
          >
          <span v-else class="avatar-initials">{{ userInitials }}</span>
        </div>
        <input type="file" id="avatar-upload" accept="image/*" @change="handleAvatarUpload" style="display: none;">
        <button class="change-avatar-btn" @click="triggerAvatarUpload">Изменить аватар</button>
        <button
          class="remove-avatar-btn"
          @click="removeAvatar"
          v-if="user.avatarUrl"
        >
          Удалить аватар
        </button>
      </div>
      <h1>{{ user.firstname }} {{ user.lastname }}</h1>
      <p class="email">{{ user.email }}</p>
    </div>
    <div class="profile-info">
      <div class="info-section">
        <h2>Основная информация</h2>
        <div class="info-item" v-if="!isAdmin"> <!-- Скрыто для админа -->
          <span class="label">Имя:</span>
          <span class="value" v-if="!editing.firstname">{{ user.firstname }}</span>
          <q-input v-else v-model="user.firstname" dense />
        </div>
        <div class="info-item">
          <span class="label">Фамилия:</span>
          <span class="value" v-if="!editing.lastname">{{ user.lastname }}</span>
          <q-input v-else v-model="user.lastname" dense />
        </div>
        <div class="info-item">
          <span class="label">Почта:</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Группа:</span>
          <span class="value" v-if="!editing.group && user.group">{{ user.group }}</span>
          <q-input v-else v-model="user.group" dense />
        </div>
        <div class="info-item">
          <span class="label">Телефон:</span>
          <span class="value" v-if="!editing.phone && user.phone">{{ user.phone }}</span>
          <q-input v-else v-model="user.phone" dense />
        </div>
        <div v-if="user.createdAt" class="info-item">
          <span class="label">Дата регистрации:</span>
          <span class="value">{{ formDate(user.createdAt) }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <template v-if="!isEditing">
          <q-btn color="primary" label="Редактировать" @click="startEditing" />
          <q-btn
            color="secondary"
            label="Изменить стек"
            @click="showTechStack = true"
            class="q-ml-sm"
            v-if="!isAdmin"
          />
        </template>
        <template v-else>
          <q-btn color="positive" label="Сохранить" @click="saveChanges" />
          <q-btn color="negative" label="Отмена" @click="cancelEditing" class="q-ml-sm" />
        </template>
      </div>
    </div>

    <!-- Модальное окно для редактирования стека технологий -->
    <q-dialog v-model="showTechStack">
      <div>
        
      </div>
      <q-card class="tech-stack-dialog" style="background-color: rgba(216, 221, 255);">
        <q-card-section style="position: sticky; top: 0; z-index: 10000; background-color: rgba(216, 221, 255); border-bottom: 1px solid rgb(128, 128, 128)">

          <div style="display: flex; justify-content: center; align-items: center;">
            <q-btn flat label="Отмена" color="black" style="
            border-radius: 8px;
            padding: 8px 16px;
            display: inline-block;
            background-color: rgba(255, 0, 0, 0.63);
            "
            v-close-popup />
            <q-btn flat label="Сохранить" color="black" style="
            border-radius: 8px;
            padding: 8px 16px;
            display: inline-block;
            margin-left: 8px;
            background-color: rgba(0, 255, 0, 0.63);
            "
            @click="saveTechStack" v-close-popup />
          </div>

          <div class="text-h6">Ваш стек технологий</div>
          <q-input 
            v-model="searchtechnology"
            outlined
            dense
            placeholder="Найти..."
            class="search-input"
            color="black"
            style="padding;"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="tech-category" v-for="(category, name) in filteredtechStack" :key="name">
            <h3>{{ getCategoryName(name) }}</h3>
            <div v-if="getCategoryName(name) == 'Языки разработки'">
              <div class="tech-items">
                <q-checkbox
                  v-for="item in category"
                  :key="item.name"
                  v-model="item.selected"
                  :label="''"
                  class="styled-checkbox checkbox-left"
                >
                  <template v-slot:default>
                    <span class="word-background languages-background" style="background-size: 75% 100%;">{{ item.name }}</span>
                  </template>
                </q-checkbox>
              </div>
            </div>
            <div v-if="getCategoryName(name) == 'Фреймворки'">
              <div class="tech-items">
                <q-checkbox
                  v-for="item in category"
                  :key="item.name"
                  v-model="item.selected"
                  :label="''"
                  class="styled-checkbox checkbox-left"
                >
                  <template v-slot:default>
                    <span class="word-background frameworks-background">{{ item.name }}</span>
                  </template>
                </q-checkbox>
              </div>
            </div>
            <div v-if="getCategoryName(name) == 'Базы данных'">
              <div class="tech-items">
                <q-checkbox
                  v-for="item in category"
                  :key="item.name"
                  v-model="item.selected"
                  :label="''"
                  class="styled-checkbox checkbox-left"
                >
                  <template v-slot:default>
                    <span class="word-background databases-background" style="background-size: 100% 100%;">{{ item.name }}</span>
                  </template>
                </q-checkbox>
              </div>
            </div>
            <div v-if="getCategoryName(name) == 'DevOps'">
              <div class="tech-items">
                <q-checkbox
                  v-for="item in category"
                  :key="item.name"
                  v-model="item.selected"
                  :label="''"
                  class="styled-checkbox checkbox-left"
                >
                  <template v-slot:default>
                    <span class="word-background devops-background">{{ item.name }}</span>
                  </template>
                </q-checkbox>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getCurrentUser, updateProfile, uploadAvatar, deleteAvatar } from '../api/users.api';
import eventBus from 'src/eventBus';

export default {
  data() {
    return {
        searchtechnology: '',
      user: {
        firstname: '',
        lastname: '',
        email: '',
        group: '',
        phone: '',
        createdAt: '',
        avatarUrl: null,
        competence: [],
        roles: [],
        isAdmin: false
      },
      originalUser: {},
      editing: {
        firstname: false,
        lastname: false,
        group: false,
        phone: false
      },
      techStack: {
        languages: [
          { name: 'Python', selected: false },
          { name: 'JavaScript', selected: false },
          { name: 'TypeScript', selected: false },
          { name: 'Java', selected: false },
          { name: 'C#', selected: false },
          { name: 'C++', selected: false },
          { name: 'C', selected: false },
          { name: 'PHP', selected: false },
          { name: 'Swift', selected: false },
          { name: 'Kotlin', selected: false },
          { name: 'GOLANG', selected: false },
          { name: 'Rust', selected: false },
          { name: 'Ruby', selected: false },
          { name: 'HTML', selected: false },
          { name: 'CSS', selected: false },
          { name: 'Dart', selected: false },
          { name: 'Scala', selected: false },
          { name: 'Lua', selected: false },
          { name: 'R', selected: false },
          { name: 'Groovy', selected: false },
          { name: 'Objective-C', selected: false },
          { name: 'Assembly', selected: false },
          { name: 'Delphi', selected: false },
          { name: 'Pascal', selected: false },
          { name: 'Visual Basic .NET', selected: false },
          { name: 'Elixir', selected: false },
          { name: 'Haskell', selected: false },
          { name: 'Fortran', selected: false },
          { name: 'COBOL', selected: false },
          { name: 'MATLAB', selected: false },
          { name: 'Ada', selected: false },
          { name: 'Lisp', selected: false },
          { name: 'Scheme', selected: false },
          { name: 'Julia', selected: false },
          { name: 'Erlang', selected: false },
          { name: 'Scratch', selected: false },
          { name: 'Prolog', selected: false },
          { name: 'Clojure', selected: false },
          { name: 'Blueprint', selected: false },
          { name: 'Objective-J', selected: false }
        ],
        frameworks: [
          { name: 'React', selected: false },
          { name: 'Vue', selected: false },
          { name: 'Angular', selected: false },
          { name: 'Next.js', selected: false },
          { name: 'Express.js', selected: false },
          { name: 'NestJS', selected: false },
          { name: 'Svelte', selected: false },
          { name: 'Django', selected: false },
          { name: 'Flask', selected: false },
          { name: 'FastAPI', selected: false },
          { name: 'Laravel', selected: false },
          { name: 'Symfony', selected: false },
          { name: 'CodeIgniter', selected: false },
          { name: 'Spring Boot', selected: false },
          { name: 'Spring MVC', selected: false },
          { name: 'ASP.NET Core', selected: false },
          { name: 'Gin', selected: false },
          { name: 'Echo', selected: false },
          { name: 'SwiftUI', selected: false },
          { name: 'UIKit', selected: false },
          { name: 'Flutter', selected: false },
          { name: 'Ember.js', selected: false },
          { name: 'Backbone.js', selected: false },
          { name: 'Meteor', selected: false },
          { name: 'AdonisJS', selected: false },
          { name: 'Nuxt.js', selected: false },
          { name: 'Remix', selected: false },
          { name: 'Phoenix', selected: false },
          { name: 'Sinatra', selected: false },
          { name: 'Koa.js', selected: false },
          { name: 'Dropwizard', selected: false },
          { name: 'Yii', selected: false },
          { name: 'CakePHP', selected: false },
          { name: 'GraphQL Yoga', selected: false }
        ],
        databases: [
          { name: 'PostgreSQL', selected: false },
          { name: 'MySQL', selected: false },
          { name: 'MongoDB', selected: false },
          { name: 'Redis', selected: false },
          { name: 'Microsoft SQL Server', selected: false },
          { name: 'SQLite', selected: false },
          { name: 'Oracle', selected: false },
          { name: 'MariaDB', selected: false },
          { name: 'DynamoDB', selected: false },
          { name: 'Cassandra', selected: false },
          { name: 'Cloud Firestore', selected: false },
          { name: 'Couchbase', selected: false },
          { name: 'InfluxDB', selected: false },
          { name: 'ArangoDB', selected: false },
          { name: 'Neo4j', selected: false },
          { name: 'Amazon Aurora', selected: false },
          { name: 'Memcached', selected: false },
          { name: 'IBM Db2', selected: false },
          { name: 'RethinkDB', selected: false },
          { name: 'Cosmos DB', selected: false },
          { name: 'Elasticsearch', selected: false },
          { name: 'ClickHouse', selected: false },
          { name: 'HBase', selected: false },
          { name: 'RavenDB', selected: false },
          { name: 'ObjectDB', selected: false },
          { name: 'OrientDB', selected: false },
          { name: 'Percona Server', selected: false },
          { name: 'TiDB', selected: false },
          { name: 'Greenplum', selected: false }
        ],
        devops: [
          { name: 'Git', selected: false },
          { name: 'Docker', selected: false },
          { name: 'Kubernetes', selected: false },
          { name: 'CI/CD', selected: false },
          { name: 'Terraform', selected: false },
          { name: 'Jenkins', selected: false },
          { name: 'Ansible', selected: false },
          { name: 'AWS CloudFormation', selected: false },
          { name: 'Azure DevOps', selected: false },
          { name: 'Google Cloud Build', selected: false },
          { name: 'Chef', selected: false },
          { name: 'Puppet', selected: false },
          { name: 'Prometheus', selected: false },
          { name: 'Grafana', selected: false },
          { name: 'Nagios', selected: false },
          { name: 'Consul', selected: false },
          { name: 'Vault', selected: false },
          { name: 'Splunk', selected: false },
          { name: 'PagerDuty', selected: false },
          { name: 'New Relic', selected: false },
          { name: 'Datadog', selected: false },
          { name: 'Sentry', selected: false },
          { name: 'Sumo Logic', selected: false },
          { name: 'CloudWatch', selected: false },
          { name: 'Azure Monitor', selected: false },
          { name: 'Google Cloud Monitoring', selected: false },
          { name: 'JFrog Artifactory', selected: false },
          { name: 'Nexus Repository', selected: false },
          { name: 'SonarQube', selected: false }
        ]
      },
      showTechStack: false,
      avatarColor: this.generateRandomColor(),
      isLoading: false,
      avatarUploadError: null
    }
  },
  computed: {
    filteredtechStack() {
      if (!this.searchtechnology){
        return this.techStack;
      }
      
      const mainFiltered = {};
      
      for (const tempCategory in this.techStack) {
        if (this.techStack.hasOwnProperty(tempCategory)) {
          const temp2Category = this.techStack[tempCategory];
          if (Array.isArray(temp2Category)) {
            const filtered = temp2Category.filter(item =>
              item.name.toLowerCase().includes(this.searchtechnology.toLowerCase())
            );
            if (filtered.length > 0) {
              mainFiltered[tempCategory] = filtered;
            }
          }
        }
      }
      return mainFiltered;
    },
    avatarStyle() {
      return {
        'background-color': this.user.avatarUrl ? 'transparent' : this.avatarColor
      };
    },
    userInitials() {
      return `${this.user.firstname.charAt(0)}${this.user.lastname.charAt(0)}`;
    },
    isEditing() {
      return Object.values(this.editing).some(val => val);
    },
    hasChanges() {
      return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
    }
  },
  methods: {
    formDate(createdAt) {
      console.log(createdAt);
      const date = new Date(createdAt);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },

    handleImageError(e) {
    console.error('Image load error:', e);
    
    // Если URL аватара недействительный, сразу переходим к стандартному аватару
    if (!this.user.avatarUrl || !this.isValidAvatarUrl(this.user.avatarUrl)) {
      this.fallbackToDefaultAvatar();
      return;
    }

    // Даем небольшой таймаут перед проверкой
    setTimeout(() => {
      const img = this.$refs.avatarImage;
      if (!img || img.naturalWidth === 0) {
        this.fallbackToDefaultAvatar();
      }
    }, 300);
  },
  watch: {
    searchtechnology() {{}
    },
  },

  isValidAvatarUrl(url) {
    if (!url) return false;
    return(url);
  },

  fallbackToDefaultAvatar() {
    this.user.avatarUrl = null;
    this.$q.notify({
      type: 'warning',
      message: 'Не удалось загрузить аватар. Используется стандартное изображение',
      timeout: 2000
    });
  },

  getFullAvatarUrl(avatarPath) {
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http')) return avatarPath;
    
    const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
    const cleanPath = avatarPath.replace(/^\//, '');
    return `${baseUrl}/${cleanPath}?t=${Date.now()}`;
  },

    generateRandomColor() {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
      return colors[Math.floor(Math.random() * colors.length)];
    },

    getCategoryName(key) {
      const names = {
        languages: 'Языки разработки',
        frameworks: 'Фреймворки',
        databases: 'Базы данных',
        devops: 'DevOps'
      };
      return names[key] || key;
    },

    async saveTechStack() {
      const selectedCompetence = [];
      Object.values(this.techStack).forEach(category => {
        category.forEach(item => {
          if (item.selected) selectedCompetence.push(item.name);
        });
      });

      try {
        const response = await updateProfile({ competence: selectedCompetence });
        if (response) {
          this.user.competence = selectedCompetence;
          localStorage.setItem('userProfile', JSON.stringify(this.user));
          
          // Обновляем чекбоксы после успешного сохранения
          this.updateTechStackCheckboxes();
          
          this.$q.notify({
            type: 'positive',
            message: 'Стек технологий обновлен',
            timeout: 2000
          });
        }
      } catch (error) {
        console.error('Ошибка сохранения стека:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при сохранении стека технологий',
          timeout: 2000
        });
      }
    },

    updateTechStackCheckboxes() {
      Object.values(this.techStack).forEach(category => {
        category.forEach(item => {
          item.selected = this.user.competence.includes(item.name);
        });
      });
    },

    startEditing() {
      this.originalUser = { ...this.user };
      this.editing = {
        firstname: true,
        lastname: true,
        group: true,
        phone: true
      };
    },

    async saveChanges() {
      this.isLoading = true;
      try {
        const payload = {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          telephone: this.user.phone,
          group: this.user.group
        };

        const updatedUser = await updateProfile(payload);
         if (updatedUser) {
          // Обновляем все поля из ответа сервера
          this.user = { 
            ...this.user,
            firstname: updatedUser.firstname || this.user.firstname,
            lastname: updatedUser.lastname || this.user.lastname,
            telephone: updatedUser.telephone || this.user.phone,
            group: updatedUser.group || this.user.group
          };
          
          localStorage.setItem('userProfile', JSON.stringify(this.user));
          
          this.$q.notify({
            type: 'positive',
            message: 'Данные успешно сохранены',
            timeout: 2000
          });
        }
      } catch (error) {
        console.error('Ошибка сохранения:', error);
         this.$q.notify({
          type: 'negative',
          message: 'Ошибка при сохранении данных',
          timeout: 2000
        });
      } finally {
        this.isLoading = false;
        this.editing = {
          firstname: false,
          lastname: false,
          group: false,
          phone: false
        };
      }
    },

    cancelEditing() {
      this.user = { ...this.originalUser };
      this.editing = {
        firstname: false,
        lastname: false,
        group: false,
        phone: false
      };
    },

    triggerAvatarUpload() {
      document.getElementById('avatar-upload').click();
    },

     async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.isLoading = true;
        const response = await uploadAvatar(file);
              
        if (response) {
          this.user.avatarUrl = response;
          
          // Сохраняем в localStorage
          localStorage.setItem('userProfile', JSON.stringify(this.user));
          
          const session = JSON.parse(localStorage.getItem('ttm-session')) || {};
          session.avatarUrl = response;
          localStorage.setItem('ttm-session', JSON.stringify(session));
          eventBus.emit('update-avatar');
          
          this.$q.notify({
            type: 'positive',
            message: 'Аватар успешно обновлен',
            timeout: 2000
            });
          }
          this.loadUserProfile();
        } catch (error) {
        console.error('Upload error:', error);
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Ошибка загрузки аватара',
          timeout: 3000
        });
      } finally {
        event.target.value = '';
        this.isLoading = false;
      }
    },
        async removeAvatar() {
      try {
        await deleteAvatar();
        this.user.avatarUrl = null;
        localStorage.setItem('userProfile', JSON.stringify(this.user));

        // Удаляем из ttm-session
        const session = JSON.parse(localStorage.getItem('ttm-session')) || {};
        session.avatarUrl = null;
        localStorage.setItem('ttm-session', JSON.stringify(session));

        // Для мгновенного обновления верхней панели:
        window.dispatchEvent(new Event('storage'));

        this.$q.notify({
          type: 'positive',
          message: 'Аватар удален',
          timeout: 2000
        });
      } catch (error) {
        console.error('Delete error:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Не удалось удалить аватар',
          timeout: 2000
        });
      }
    },
    async loadUserProfile() {
  try {
    const userData = await getCurrentUser();
    if (userData) {
      this.user = {
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        group: userData.group || '',
        phone: userData.telephone || '',
        createdAt: userData.createdAt,
        avatarUrl: userData.avatarUrl || null,
        competence: userData.competence || [],
        roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles]
      };

      // Сохраняем оригинальные данные
      this.isAdmin = this.user.roles.some(role => role.toLowerCase() === 'admin');
      this.originalUser = { ...this.user };
      localStorage.setItem('userProfile', JSON.stringify(this.user));

      // --- Сохраняем в ttm-session для MainLayout ---
      const session = JSON.parse(localStorage.getItem('ttm-session')) || {};
      session.avatarUrl = this.user.avatarUrl;
      session.firstname = this.user.firstname;
      session.lastname = this.user.lastname;
      localStorage.setItem('ttm-session', JSON.stringify(session));
      // ---------------------------------------------

      // Обновляем чекбоксы технологий
      Object.values(this.techStack).forEach(items => {
        items.forEach(item => {
          item.selected = this.user.competence.includes(item.name);
          this.updateTechStackCheckboxes();
        });
      });

      this.$emit('user-updated', {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        avatarUrl: this.user.avatarUrl
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
},

      async loadSavedProfile() {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        this.originalUser = { ...this.user };
        this.updateTechStackCheckboxes();
        this.user = JSON.parse(savedProfile);
        this.isAdmin = Array.isArray(this.user.roles) 
        ? this.user.roles.some(role => role.toLowerCase() === 'admin')
        : false;
      }
    }
  },
  async mounted() {
    await this.loadSavedProfile();
    await this.loadUserProfile();
  }
}
</script>

<style scoped>
.search-input {
  background-color: rgba(0, 174, 255, 0.43) !important;
  font-size: 18px;
  margin-bottom: 10px;
}

.checkbox-left .q-checkbox__inner {
  display: flex;
  align-items: center;
}

.checkbox-left .q-checkbox__inner--left {
  order: 0;
  margin-right: 8px;
}

.checkbox-left .q-checkbox__inner--label {
  order: 1;
  flex-grow: 1;
}

.languages-background {
  background-image: url('../assets/background_languages.png');
}

.frameworks-background {
  background-image: url('../assets/background_frameworks.png');
}

.databases-background {
  background-image: url('../assets/background_databases.png');
}

.devops-background {
  background-image: url('../assets/background_DevOps.png');
}

.word-background {
  padding: 2px 30px;
  color: black;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  font-size: 16px;
}

.styled-checkbox .q-checkbox__bg{
    background: none;
    border: none;
}

.styled-checkbox .q-checkbox__inner::before {
    background: none;
    border: 1px solid;
}

.styled-checkbox .q-checkbox__inner.q-checkbox__inner--falsy::before {
    border: 1px solid #999;
}

.styled-checkbox .q-checkbox__inner.q-checkbox__inner--truthy::before {
    border: 1px solid green;
    background-color: green;
}

.styled-checkbox .q-checkbox__label {
  margin-left: 0;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-container {
  margin-bottom: 15px;
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  margin: 0 auto 10px;
  font-weight: bold;
  overflow: hidden;
  position: relative;
  border: 2px solid #eee;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-btn {
  background: none;
  border: none;
  color: #1976D2;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
}

.change-avatar-btn:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.remove-avatar-btn {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
}

.remove-avatar-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.profile-info {
  background: var(--projects-section);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 20px;
}

.info-section h2 {
  margin-bottom: 15px;
  font-size: 18px;
  color: var(--main-color);
}

.info-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.label {
  font-weight: bold;
  width: 120px;
  color: var(--secondary-color);
}

.value {
  flex: 1;
  color: var(--main-color);
}

.action-buttons {
  margin-top: 20px;
  text-align: right;
}

.email {
  color: var(--secondary-color);
  margin-top: 5px;
}

.tech-stack-dialog {
  min-width: 400px;
  max-width: 600px;
}

.tech-category {
  margin-bottom: 20px;
}

.tech-category h3 {
  margin-bottom: 10px;
  color: var(--main-color);
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
