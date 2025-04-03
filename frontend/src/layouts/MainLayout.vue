<template>
  <div class="app-container" :class="{ 'dark': darkMode }">
    <!-- Верхнее меню -->
    <header class="app-header">
      <div class="app-header-left">
        <span class="app-icon"></span>
        <p class="app-name">ПОРТАЛ ПРОЕКТОВ</p>
        <div class="search-wrapper">
          <input 
            class="search-input" 
            type="text" 
            placeholder="Поиск"
            v-model="searchQuery"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>
      </div>
      <div class="app-header-right">
        <button 
          class="mode-switch" 
          title="Переключить тему"
          @click="toggleDarkMode"
          :class="{ 'active': darkMode }"
        >
          <svg class="moon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="24" height="24" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
          </svg>
        </button>
        
        <button class="notification-btn" @click="toggleNotifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="notification-badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</span>
        </button>
        
        <div class="profile-dropdown">
          <button class="profile-btn" @click="toggleProfileDropdown">
            <img src="" alt="Profile" />
            <span>{{ userName }}</span>
          </button>
          <div class="dropdown-menu" v-if="showProfileDropdown">
            <router-link to="/profile" class="dropdown-item">Мой профиль</router-link>
            <router-link to="/settings" class="dropdown-item">Настройки</router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" @click="logout">Выйти</button>
          </div>
        </div>
      </div>
    </header>

    <div class="app-content">
      <!-- Боковое меню -->
      <nav class="app-sidebar">
        <router-link 
          to="/" 
          class="app-sidebar-link" 
          :class="{ 'active': $route.name === 'projects' }"
          title="Проекты"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </router-link>
        
        <router-link 
          to="/tasks" 
          class="app-sidebar-link" 
          :class="{ 'active': $route.name === 'tasks' }"
          title="Идеи"
        >
          <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" />
          </svg>
        </router-link>
        
        <router-link 
          to="/users" 
          class="app-sidebar-link" 
          :class="{ 'active': $route.name === 'users' }"
          title="Команды"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </router-link>

        <router-link 
          to="/addinteam" 
          class="app-sidebar-link" 
          :class="{ 'active': $route.name === 'addinteam' }"
          title="Добавить в команду"
        >
          <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" />
          </svg>
        </router-link>
      </nav>

      <!-- Основное содержимое страницы -->
      <main class="main-content">
        <router-view></router-view> <!-- Сюда будут вставляться страницы -->
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      darkMode: false,
      searchQuery: '',
      showProfileDropdown: false,
      userName: 'Иван Иванов',
      unreadNotifications: 3
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    toggleNotifications() {
      this.unreadNotifications = 0; // Помечаем как прочитанные
    },
    logout() {
      // Логика выхода
      this.$router.push('/login');
    }
  }
}
</script>

<style>
:root {
  --app-container: #f3f6fd;
  --main-color: #1f1c2e;
  --secondary-color: #4A4A4A;
  --link-color: #1f1c2e;
  --link-color-hover: #c3cff4;
  --link-color-active: #fff;
  --link-color-active-bg: #1f1c2e;
  --projects-section: #fff;
  --message-box-hover: #fafcff;
  --message-box-border: #e9ebf0;
  --more-list-bg: #fff;
  --more-list-bg-hover: #f6fbff;
  --more-list-shadow: rgba(209, 209, 209, 0.4);
  --button-bg: #1f1c24;
  --search-area-bg: #fff;
  --message-btn: #fff;
}

.dark {
  --app-container: #1f1d2b;
  --main-color: #fff;
  --secondary-color: rgba(255,255,255,.8);
  --projects-section: #1f2937;
  --link-color: rgba(255,255,255,.8);
  --link-color-hover: rgba(195, 207, 244, 0.1);
  --link-color-active-bg: rgba(195, 207, 244, 0.2);
  --button-bg: #1f2937;
  --search-area-bg: #1f2937;
  --message-box-hover: #243244;
  --message-box-border: rgba(255,255,255,.1);
  --more-list-bg: #2f3142;
  --more-list-bg-hover: rgba(195, 207, 244, 0.1);
  --more-list-shadow: rgba(195, 207, 244, 0.1);
  --message-btn: rgba(195, 207, 244, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--app-container);
  transition: .2s;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  background-color: var(--projects-section);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.app-header-left, .app-header-right {
  display: flex;
  align-items: center;
}

.app-header-left { 
  flex-grow: 1; 
} 

.app-header-right button {
  margin-left: 10px;
}

.app-icon {
  width: 26px;
  height: 2px;
  border-radius: 4px;
  background-color: var(--main-color);
  position: relative;
}

.app-icon:before, .app-icon:after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  border-radius: 4px;
  background-color: var(--main-color);
  left: 50%;
  transform: translatex(-50%);
}

.app-icon:before { top: -6px; }
.app-icon:after { bottom: -6px; }

.app-name {
  color: var(--main-color);
  margin: 0 32px;
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  text-transform: uppercase;
}

.search-wrapper {
  border-radius: 20px;
  background-color: var(--search-area-bg);
  padding-right: 12px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 2px 6px 0 rgba(136,148,171,.2),0 24px 20px -24px rgba(71,82,107,.1);
}

.search-input {
  border: none;
  flex: 1;
  outline: none;
  height: 100%;
  padding: 0 20px;
  font-size: 16px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.search-input::placeholder {
  color: var(--main-color);
  opacity: .6;
}

.mode-switch {
  background-color: transparent;
  border: none;
  padding: 0;
  color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.mode-switch:hover {
  background-color: var(--link-color-hover);
}

.notification-btn {
  color: var(--main-color);
  padding: 0;
  border: 0;
  background-color: transparent;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.notification-btn:hover {
  background-color: var(--link-color-hover);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.profile-dropdown {
  position: relative;
  margin-left: 10px;
}

.profile-btn {
  padding: 0 12px;
  border: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 20px;
  transition: background-color 0.3s;
  color: var(--main-color);
}

.profile-btn:hover {
  background-color: var(--link-color-hover);
}

.profile-btn img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 8px;
}

.profile-btn span {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  margin-right: 8px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background-color: var(--more-list-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--more-list-shadow);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--main-color);
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--more-list-bg-hover);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--message-box-border);
  margin: 4px 0;
}

.logout {
  color: #ff4757;
}

.app-content {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.app-sidebar {
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--projects-section);
  border-right: 1px solid var(--message-box-border);
  width: 80px;
  flex-shrink: 0;
}

.app-sidebar-link {
  color: var(--link-color);
  margin: 16px 0;
  transition: .2s;
  border-radius: 50%;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.app-sidebar-link:hover {
  background-color: var(--link-color-hover);
  color: var(--link-color-active);
}

.app-sidebar-link.active {
  background-color: var(--link-color-active-bg);
  color: var(--link-color-active);
}

.app-sidebar-link::after {
  content: attr(title);
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--more-list-bg);
  color: var(--main-color);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.app-sidebar-link:hover::after {
  opacity: 1;
  visibility: visible;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--app-container);
}
</style>