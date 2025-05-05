<template>
  <div class="profile-container" :class="{'admin-profile': isAdmin}">
     <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar" :style="avatarStyle">
          <img
             v-if="user.avatarUrl"
             :src="getFullAvatarUrl(user.avatarUrl)"
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
        <div class="info-item">
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
        <div class="info-item" v-if="!isAdmin"> <!-- Скрыто для админа -->
          <span class="label">Группа:</span>
          <span class="value" v-if="!editing.group && user.group">{{ user.group }}</span>
          <q-input v-else v-model="user.group" dense />
        </div>
        <div class="info-item">
          <span class="label">Телефон:</span>
          <span class="value" v-if="!editing.phone && user.phone">{{ user.phone }}</span>
          <q-input v-else v-model="user.phone" dense />
        </div>
        <div class="info-item">
          <span class="label">Дата регистрации:</span>
          <span class="value">{{ user.registrationDate }}</span>
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
      <q-card class="tech-stack-dialog">
        <q-card-section>
          <div class="text-h6">Ваш стек технологий</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="tech-category" v-for="(category, name) in techStack" :key="name">
            <h3>{{ getCategoryName(name) }}</h3>
            <div class="tech-items">
              <q-checkbox
                v-for="item in category"
                :key="item.name"
                v-model="item.selected"
                :label="item.name"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="negative" v-close-popup />
          <q-btn flat label="Сохранить" color="positive" @click="saveTechStack" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getCurrentUser, updateProfile, uploadAvatar, deleteAvatar } from '../api/users.api';

export default {
  data() {
    return {
      user: {
        firstname: '',
        lastname: '',
        email: '',
        group: '',
        phone: '',
        registrationDate: new Date().toISOString(),
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
           { name: 'PHP', selected: false },
          { name: 'Blueprint', selected: false },
          { name: 'GOLANG', selected: false },
          { name: 'Rust', selected: false },
          { name: 'JavaScript', selected: false },
          { name: 'TypeScript', selected: false },
          { name: 'Python', selected: false }
        ],
        frameworks: [
           { name: 'Node.js', selected: false },
          { name: 'Vue', selected: false },
          { name: 'React', selected: false },
          { name: 'Angular', selected: false },
          { name: 'Django', selected: false },
          { name: 'Laravel', selected: false }
        ],
        databases: [
            { name: 'MongoDB', selected: false },
          { name: 'SQL', selected: false },
          { name: 'PostgreSQL', selected: false },
          { name: 'Redis', selected: false },
          { name: 'Firebase', selected: false }
        ],
        devops: [
           { name: 'Git', selected: false },
          { name: 'Docker', selected: false },
          { name: 'Kubernetes', selected: false },
          { name: 'CI/CD', selected: false },
          { name: 'Terraform', selected: false }
        ]
      },
      showTechStack: false,
      avatarColor: this.generateRandomColor(),
      isLoading: false,
      avatarUploadError: null
    }
  },
  computed: {
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
     formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    },





    handleImageError(e) {
    console.error('Image load error:', e);
    
    // Если URL аватара недействительный, сразу переходим к стандартному аватару
    if (!this.user.avatarUrl || !this.isValidAvatarUrl(this.user.avatarUrl)) {
      this.fallbackToDefaultAvatar();
      return;
    }

    // Попробуем загрузить без параметров кеширования
    const cleanUrl = this.user.avatarUrl.split('?')[0];
    this.user.avatarUrl = `${cleanUrl}?retry=${Date.now()}`;

    // Даем небольшой таймаут перед проверкой
    setTimeout(() => {
      const img = this.$refs.avatarImage;
      if (!img || img.naturalWidth === 0) {
        this.fallbackToDefaultAvatar();
      }
    }, 300);
  },

  isValidAvatarUrl(url) {
    if (!url) return false;
    // Проверяем, что URL выглядит корректно
    return url.startsWith('/uploads/avatars/') || 
           url.startsWith('http://') || 
           url.startsWith('https://');
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
    
    if (response?.avatarUrl) {
      // Обновляем URL аватара с временной меткой
      this.user.avatarUrl = `${response.avatarUrl}?t=${Date.now()}`;
      
      // Сохраняем в localStorage
      localStorage.setItem('userProfile', JSON.stringify(this.user));
      
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
            registrationDate: userData.createdAt 
              ? this.formatDate(userData.createdAt)
              : this.formatDate(new Date().toISOString()),
            avatarUrl: userData.avatarUrl || null,

            competence: userData.competence || [],
            roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles]
          };

           this.isAdmin = this.user.roles.some(role => role.toLowerCase() === 'admin');
      console.log('User roles:', this.user.roles, 'Is admin:', this.isAdmin); // Для отладки

          this.originalUser = { ...this.user };
          localStorage.setItem('userProfile', JSON.stringify(this.user));

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
