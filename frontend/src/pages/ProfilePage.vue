<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar" :style="{ 'background-color': avatarColor }">
          {{ userInitials }}
        </div>
        <input type="file" id="avatar-upload" accept="image/*" @change="handleAvatarUpload" style="display: none;">
        <button class="change-avatar-btn" @click="triggerAvatarUpload">Изменить аватар</button>
      </div>
      <h1>{{ fullName }}</h1>
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
    return {
      user: {
        firstname: 'Иван',
        lastname: 'Иванов',
        email: 'ivanovin@std.tyuiu.ru',
        group: 'ACOиУ6-24-1',
        phone: '+7(999)-999-99-99',
        registrationDate: '07.04.2025'
      },
      editing: {
        firstname: false,
        lastname: false,
        group: false,
        phone: false
      },
      avatarColor: this.generateRandomColor()
    }
  },
  computed: {
    fullName() {
      return `${this.user.firstname} ${this.user.lastname}`;
    },
    userInitials() {
      return `${this.user.firstname.charAt(0)}${this.user.lastname.charAt(0)}`;
    },
    isEditing() {
      return Object.values(this.editing).some(val => val);
    }
  },
  methods: {
    generateRandomColor() {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    startEditing() {
      this.editing = {
        firstname: true,
        lastname: true,
        group: true,
        phone: true
      };
    },
    saveChanges() {
      // Здесь можно добавить логику сохранения данных
      this.editing = {
        firstname: false,
        lastname: false,
        group: false,
        phone: false
      };
    },
    cancelEditing() {
      // Можно добавить подтверждение изменений
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
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Здесь можно обработать загруженное изображение
          console.log('Avatar uploaded:', e.target.result);
        };
        reader.readAsDataURL(file);
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
}

.change-avatar-btn {
  background: none;
  border: none;
  color: #1976D2;
  cursor: pointer;
  font-size: 14px;
}

.change-avatar-btn:hover {
  text-decoration: underline;
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