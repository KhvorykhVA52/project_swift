<template>
  <q-page class="row items-center justify-evenly auth-container">
    <form class="form neo-form" @submit.prevent="onLogin">
      <div class="form__loader" v-if="loading">
        <div class="spinner active">
          <svg class="spinner__circular" viewBox="25 25 50 50">
            <circle class="spinner__path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"></circle>
          </svg>
        </div>
      </div>
      
      <div class="form__content" :class="{ 'form-loaded': !loading }">
        <h1 class="form-title">Авторизация</h1>
        
        <div class="input-group">
          <div class="styled-input">
            <input 
              type="text" 
              class="styled-input__input" 
              v-model="login"
              placeholder="Введите ваш логин"
              @focus="handleInputFocus($event)"
              @blur="handleInputBlur($event)"
            >
          </div>
        </div>

        <div class="input-group">
          <div class="styled-input">
            <input 
              type="password" 
              class="styled-input__input"
              v-model="password"
              placeholder="Введите пароль"
              @focus="handleInputFocus($event)"
              @blur="handleInputBlur($event)"
            >
          </div>
        </div>

        <button type="submit" class="styled-button neo-button">
          <span>Войти</span>
        </button>

        <p class="auth-switch">
          Нет аккаунта? 
          <a href="#" @click.prevent="onSignUp" class="auth-link">Зарегистрироваться</a>
        </p>
      </div>
    </form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as api from '../api/auth.api';
import { useMainStore } from 'src/stores/main-store';
import { useQuasar } from 'quasar';

const router = useRouter();
const mainStore = useMainStore();
const $q = useQuasar();

const login = ref('');
const password = ref('');
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1800);
  
  // Убираем стили автозаполнения
  const inputs = document.querySelectorAll<HTMLInputElement>('.styled-input__input');
  setTimeout(() => {
    inputs.forEach(input => {
      if ((input as HTMLElement).matches(':-webkit-autofill')) {
        (input as HTMLElement).style.setProperty('box-shadow', '0 0 0 1000px rgba(15, 23, 42, 0.5) inset');
        (input as HTMLElement).style.setProperty('-webkit-text-fill-color', 'white');
      }
    });
  }, 100);
});
const handleInputFocus = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const parent = target.parentNode as HTMLElement;
  if (parent) parent.classList.add('focused');
};

const handleInputBlur = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const parent = target.parentNode as HTMLElement;
  if (parent) parent.classList.remove('focused');
};

const onLogin = async () => {
  try {
    const response = await api.login(login.value, password.value);
    if (response) {
      mainStore.initAppState(response);
      router.push({ path: '/' });
    } else {
      showError();
    }
  } catch {
    showError();
  }
};

const showError = () => {
  $q.notify({
    message: 'Ошибка входа',
    caption: 'Проверьте логин и пароль',
    color: 'negative',
    icon: 'error'
  });
};

const onSignUp = () => {
  router.push({ path: '/signup' });
};
</script>

<style scoped>
.auth-container {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
}

.neo-form {
  width: 100%;
  max-width: 380px;
  padding: 40px 30px;
  border-radius: 16px;
  background: #1e293b;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.3),
              -8px -8px 16px rgba(72, 84, 108, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 32px;
  text-align: center;
}

.input-group {
  margin-bottom: 24px;
}

.styled-input {
  position: relative;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.styled-input:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.styled-input.focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.styled-input__input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: white;
  background: transparent;
  border: none;
  outline: none;
}

.styled-input__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  transition: opacity 0.2s ease;
}

.styled-input__input:focus::placeholder {
  opacity: 0;
}

/* Стили для автозаполнения */
.styled-input__input:-webkit-autofill,
.styled-input__input:-webkit-autofill:hover, 
.styled-input__input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0 1000px rgba(15, 23, 42, 0.5) inset;
  transition: background-color 5000s ease-in-out 0s;
}

.neo-button {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.neo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
}

.auth-switch {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.auth-link {
  color: #93c5fd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #3b82f6;
}

/* Анимации */
.form__loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 41, 59, 0.8);
  z-index: 10;
  transition: opacity 0.5s;
}

.form__content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease 0.3s;
}

.form-loaded {
  opacity: 1;
  transform: translateY(0);
}

.spinner__path {
  stroke: #3b82f6;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>