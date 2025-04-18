<template>
  <div class="app-container">
    <header class="app-header">
      <div class="app-header-left">
        <div class="app-icon"></div>
        <p class="app-name">ПОРТАЛ ПРОЕКТОВ</p>
        <div class="search-wrapper">
          <input
            class="search-input"
            type="text"
            placeholder="Поиск"
            v-model="searchQuery"
          />
          <span class="search-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="app-header-right">
        <button class="mode-switch" @click="toggleDarkMode" :class="{ 'active': darkMode }">
          <svg viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <button class="notification-btn" @click="toggleNotifications">
          <svg viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M13.73 21a2 2 0 01-3.46 0" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="notification-badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</span>
        </button>

        <div class="profile-dropdown">
          <button class="profile-btn" @click="toggleProfileDropdown">
            <span class="profile-avatar">{{ userInitials }}</span>
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
      <nav class="app-sidebar">
        <router-link
          v-for="link in sidebarLinks"
          :key="link.path"
          :to="link.path"
          class="app-sidebar-link"
          :class="{ 'active': $route.path === link.path }"
          :title="link.title"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid slice"
          >
            <path :d="link.icon" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </router-link>
      </nav>

      <main class="main-content">
        <router-view></router-view>
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
      unreadNotifications: 3,
      sidebarLinks: [
        { 
          path: '/', 
          title: 'Проекты', 
          icon: 'M5 17C3.89543 17 3 16.2325 3 15.2857V6.71429C3 5.76751 3.89543 5 5 5H19C20.1046 5 21 5.76751 21 6.71429V15.2857C21 16.2325 20.1046 17 19 17 M12 15L17.1962 21H6.80385L12 15Z' 
        },
        { 
          path: '/tasks', 
          title: 'Идеи', 
          icon: 'M9.6 15.1397C12 15.1397 11.1467 15.1397 12 15.1397C12.8533 15.1397 12 15.1397 14.4 15.1397M9.6 15.1397C7.48091 14.1624 6 11.9304 6 9.33333C6 5.83553 8.68629 3 12 3C15.3137 3 18 5.83553 18 9.33333C18 11.9304 16.5191 14.1624 14.4 15.1397M9.6 15.1397V17.5C9.6 18.0523 10.0477 18.5 10.6 18.5H13.4C13.9523 18.5 14.4 18.0523 14.4 17.5V15.1397M13 21H11M11 11H13' 
        },
        { 
          path: '/users', 
          title: 'Пользователи', 
          icon: 'M 8.5 21 L 4 21 C 4 17.132812 7.132812 14 11 14 C 11.167969 14 11.335938 14.007812 11.5 14.019531 M 15 7 C 15 9.210938 13.210938 11 11 11 C 8.789062 11 7 9.210938 7 7 C 7 4.789062 8.789062 3 11 3 C 13.210938 3 15 4.789062 15 7 Z M 12.589844 21 L 14.613281 20.59375 C 14.792969 20.558594 14.878906 20.542969 14.960938 20.507812 C 15.035156 20.480469 15.105469 20.445312 15.167969 20.398438 C 15.242188 20.347656 15.304688 20.285156 15.433594 20.15625 L 19.589844 16 C 20.140625 15.449219 20.140625 14.550781 19.589844 14 C 19.039062 13.449219 18.140625 13.449219 17.589844 14 L 13.433594 18.15625 C 13.304688 18.285156 13.242188 18.347656 13.191406 18.421875 C 13.144531 18.484375 13.109375 18.554688 13.082031 18.628906 C 13.046875 18.710938 13.03125 18.796875 12.996094 18.976562 Z M 12.589844 21 ' 
        },
        { 
          path: '/listofmyteams', 
          title: 'Мои команды',
          icon: 'M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9ZM14 9C15.6569 9 17 7.65685 17 6C17 4.34315 15.6569 3 14 3 M11 12H7C4.79086 12 3 13.7909 3 16C3 17.6569 4.34315 19 6 19H12C13.6569 19 15 17.6569 15 16C15 13.7909 13.2091 12 11 12Z M17 12C19.2091 12 21 13.7909 21 16C21 17.6569 19.6569 19 18 19',
        },
      ]
    }
  },
  computed: {
    userName() {
      const savedUser = localStorage.getItem('userProfile');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return `${user.firstname} ${user.lastname}`;
      }
      return 'Виктор Иванов';
    },
    userInitials() {
      const savedUser = localStorage.getItem('userProfile');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;
      }
      return 'ВИ';
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    toggleNotifications() {
      this.unreadNotifications = 0;
    },
    logout() {
      this.$router.push('/login');
    },
    handleUserUpdate() {
      // Принудительное обновление computed свойств
      this.$forceUpdate();
    }
  },
  mounted() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }
    // Подписываемся на событие обновления пользователя
    window.addEventListener('userUpdated', this.handleUserUpdate);
  },
beforeUnmount() {
  // Отписываемся от события при уничтожении компонента
  window.removeEventListener('userUpdated', this.handleUserUpdate);
}
}
</script>

<style>
/* Ваши существующие стили остаются без изменений */
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
  transition: background-color 0.3s;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.app-icon {
  width: 26px;
  height: 2px;
  background-color: var(--main-color);
  position: relative;
}

.app-icon:before, .app-icon:after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background-color: var(--main-color);
  left: 50%;
  transform: translateX(-50%);
}

.app-icon:before { top: -6px; }
.app-icon:after { bottom: -6px; }

.app-name {
  color: var(--main-color);
  margin: 0 32px;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--search-area-bg);
  border-radius: 20px;
  padding: 8px 16px;
  width: 100%;
  max-width: 480px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: var(--main-color);
}

.search-icon svg {
  width: 20px;
  height: 20px;
}

.mode-switch, .notification-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}

.mode-switch:hover, .notification-btn:hover {
  background-color: var(--link-color-hover);
}

.notification-btn {
  position: relative;
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
}

.profile-dropdown {
  position: relative;
  margin-left: 16px;
}

.profile-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
}

.profile-btn:hover {
  background-color: var(--link-color-hover);
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--button-bg);
  color: white;
  border-radius: 50%;
  margin-right: 8px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
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
}

.dropdown-item:hover {
  background-color: var(--more-list-bg-hover);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--message-box-border);
}

.logout {
  color: #ff4757;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.app-content {
  display: flex;
  height: calc(100vh - 60px);
}

.app-sidebar {
  width: 80px;
  background-color: var(--projects-section);
  border-right: 1px solid var(--message-box-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
}

.app-sidebar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 16px 0;
  position: relative;
  color: var(--link-color);
}

.app-sidebar-link:hover {
  background-color: var(--link-color-hover);
  color: var(--link-color-active);
}

.app-sidebar-link.active {
  background-color: var(--link-color-active-bg);
  color: var(--link-color-active);
}

.app-sidebar-link svg {
  width: 24px;
  height: 24px;
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  pointer-events: none;
  min-width: max-content;
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