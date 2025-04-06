import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import ProjectsPage from 'pages/ProjectsPage.vue';
import UsersPage from 'pages/UsersPage.vue';
import UserEditPage from 'pages/UserEditPage.vue';
import TasksPage from 'pages/TasksPage.vue';
import AddInTeamPage from 'pages/AddInTeamPage.vue';
import ServiceLayout from 'layouts/ServiceLayout.vue';
import LoginPage from 'pages/LoginPage.vue';
import SignupPage from 'pages/SignupPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'projects', component: ProjectsPage },
      { path: 'users', name: 'users', component: UsersPage },
      { path: 'users/:id', component: UserEditPage },
      { path: 'tasks', name: 'tasks', component: TasksPage },
      { path: 'addinteam', name: 'addinteam', component: AddInTeamPage },
    ],
  },
  {
    path: '/login',
    component: ServiceLayout,
    children: [{ path: '', component: LoginPage }],
  },
  {
    path: '/signup',
    component: ServiceLayout,
    children: [{ path: '', component: SignupPage }],
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];

export default routes;