import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
// import { useQuasar } from 'quasar';
import {
  LoginResponseDto,
  Role,
  SecuredUser,
  UserAccountStatus,
} from '../../../backend/src/common/types';
// import * as authApi from '../api/auth.api';

export const useMainStore = defineStore('main', () => {
  // const $q = useQuasar();
  const state = reactive({
    userId: 0,
    username: 'unknown',
    firstname: 'unknown',
    avatarUrl: 'unknown',
    lastname: 'unknown',
    roles: [] as Role[],
    userStatus: UserAccountStatus,
  });

  const initAppState = (appState: LoginResponseDto) => {
    state.userId = appState.userId;
    state.username = appState.username;
    state.firstname = appState.firstname;
    state.lastname = appState.lastname;
    state.roles = appState.roles;
  };

  const getCurrentUser = (): SecuredUser => {
    return {
      id: state.userId,
      email: state.username,
      firstname: state.firstname,
      avatarUrl: state.avatarUrl,
      lastname: state.lastname,
      roles: state.roles,
      status: UserAccountStatus.active,
    };
  };

  const isAdmin = () => state.roles.some((r) => r == Role.admin);
  const isUser = () => state.roles.some((r) => r == Role.user);

  return {
    ...toRefs(state),
    initAppState,
    isAdmin,
    isUser,
    getCurrentUser,
  };
});