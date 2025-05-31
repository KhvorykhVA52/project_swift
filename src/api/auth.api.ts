import { api } from './axios';

import {

  LoginResponseDto,

  SignUpRequestDto,

  SignupResponseDto,

} from '../../../backend/src/common/types';

 

function useJwtToken(token: string) {

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

}

 

export async function login(

  username: string,

  password: string

): Promise<LoginResponseDto | undefined> {

  const response = await api.post('/auth/login', {

    username,

    password,

  });

  if (response.status == 200) {

    useJwtToken(response.data.access_token);

    //save token to local storage

    localStorage.setItem('ttm-session', JSON.stringify(response.data));

 

    return response.data;

  }

  return;

}

 

export async function refresh() {

  const rawSavedSession = localStorage.getItem('ttm-session');

  if (rawSavedSession) {

    const savedSession: LoginResponseDto = JSON.parse(rawSavedSession);

    useJwtToken(savedSession.access_token);

    return savedSession;

  }

}

 

export function logout() {

  localStorage.removeItem('ttm-session');

}

 

export async function signup(

  payload: SignUpRequestDto

): Promise<SignupResponseDto> {

  const response = await api.post('/auth/signup', payload);

  return response.data;

}