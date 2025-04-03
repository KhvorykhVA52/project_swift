import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProjectsPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') }, 
      { path: 'users/:id', component: () => import('pages/UserEditPage.vue') },
      { path: 'ideas', component: () => import('pages/TasksPage.vue') },
      { path: 'addinteam', component: () => import('pages/AddInTeamPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;