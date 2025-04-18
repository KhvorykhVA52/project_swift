<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar" :style="avatarStyle">
          <img v-if="user.avatar" :src="user.avatar" alt="Аватар" class="avatar-image">
          <span v-else>{{ userInitials }}</span>
        </div>
        <input type="file" id="avatar-upload" accept="image/*" @change="handleAvatarUpload" style="display: none;">
        <button class="change-avatar-btn" @click="triggerAvatarUpload">Изменить аватар</button>
      </div>
      <h1>{{ fullName }}</h1>
      <p class="email">{{ user.email }}</p>
      <button 
            class="remove-avatar-btn" 
            @click="removeAvatar"
            v-if="user.avatar"
          >
            Удалить аватар
          </button>
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
        <div class="info-item">
          <span class="label">Группа:</span>
          <span class="value" v-if="!editing.group">{{ user.group }}</span>
          <q-input v-else v-model="user.group" dense />
        </div>
        <div class="info-item">
          <span class="label">Телефон:</span>
          <span class="value" v-if="!editing.phone">{{ user.phone }}</span>
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
        </template>
        <template v-else>
          <q-btn color="positive" label="Сохранить" @click="saveChanges" />
          <q-btn color="negative" label="Отмена" @click="cancelEditing" class="q-ml-sm" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const savedUser = localStorage.getItem('userProfile');
    const defaultUser = {
      firstname: 'Иван',
      lastname: 'Иванов',
      email: 'ivanovin@std.tyuiu.ru',
      group: 'ACOиУ6-24-1',
      phone: '+7(999)-999-99-99',
      registrationDate: '07.04.2025',
            avatar: localStorage.getItem('userAvatar') || null

    };

    return {
      user: savedUser ? { ...defaultUser, ...JSON.parse(savedUser) } : defaultUser,
      originalUser: savedUser ? { ...defaultUser, ...JSON.parse(savedUser) } : {...defaultUser},
      editing: {
        firstname: false,
        lastname: false,
        group: false,
        phone: false
      },
      avatarColor: this.getSavedColor() || this.generateRandomColor(),
      isLoading: false
    }
  },
  computed: {
    avatarStyle() {
      return {
        'background-color': this.user.avatar ? 'transparent' : this.avatarColor
      };
    },
 fullName() {
      return `${this.user.firstname} ${this.user.lastname}`;
    },
    userInitials() {
      return `${this.user.firstname.charAt(0)}${this.user.lastname.charAt(0)}`;
    },
    isEditing() {
      return Object.values(this.editing).some(val => val);
    },
    hasChanges() {
      return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
    }  },

   methods: {
    generateRandomColor() {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    getSavedColor() {
      return localStorage.getItem('avatarColor');
    },
    startEditing() {
      this.originalUser = {...this.user};
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
        this.saveUserData();
        this.$q.notify({
          type: 'positive',
          message: 'Данные успешно сохранены',
          timeout: 2000
        });
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
    saveUserData() {
      localStorage.setItem('userProfile', JSON.stringify(this.user));
      localStorage.setItem('avatarColor', this.avatarColor);
      if (this.user.avatar) {
        localStorage.setItem('userAvatar', this.user.avatar);
      }
      this.originalUser = {...this.user};
      window.dispatchEvent(new CustomEvent('userUpdated', {
        detail: this.user
      }));
    },
    cancelEditing() {
      this.user = {...this.originalUser};
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
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Проверка типа файла
      if (!file.type.match('image.*')) {
        this.$q.notify({
          type: 'negative',
          message: 'Пожалуйста, выберите файл изображения',
          timeout: 2000
        });
        return;
      }

      // Проверка размера файла (не более 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.$q.notify({
          type: 'negative',
          message: 'Размер файла не должен превышать 2MB',
          timeout: 2000
        });
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.user.avatar = e.target.result;
        this.saveUserData();
        this.$q.notify({
          type: 'positive',
          message: 'Аватар успешно изменен',
          timeout: 2000
        });
      };
      
      reader.onerror = () => {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке изображения',
          timeout: 2000
        });
      };
      
      reader.readAsDataURL(file);
    },
    removeAvatar() {
      this.user.avatar = null;
      localStorage.removeItem('userAvatar');
      this.saveUserData();
      this.$q.notify({
        type: 'positive',
        message: 'Аватар удален',
        timeout: 2000
      });
    }
  },
  mounted() {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.originalUser = {...this.user};
    }

    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar && !this.user.avatar) {
      this.user.avatar = savedAvatar;
    }
  },
  watch: {
    user: {
      deep: true,
      handler(newVal) {
        localStorage.setItem('userProfile', JSON.stringify(newVal));
      }
    }
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
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
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
</style>