import { api } from './axios';

import { CreateUserDto, SecuredUser, UpdateUserDto } from '../../../backend/src/common/types';

 

export async function getAll(): Promise<SecuredUser[]> {

  const response = await api.get('/users');

  if (response.status == 200) {

    return response.data;

  }

  return [];

}

 

export async function create(

  newUser: CreateUserDto

): Promise<SecuredUser | undefined> {

  const response = await api.post('/users/', newUser);

  if (response.status == 201) {

    return response.data;

  }

  return;

}

 

export async function get(id: number): Promise<SecuredUser | undefined> {

  const response = await api.get('/users/' + id);

  if (response.status == 200) {

    return response.data;

  }

  return;

}

 

export async function update(

  id: number,

  payload: UpdateUserDto

): Promise<SecuredUser | undefined> {

  const response = await api.patch('/users/' + id, payload);

  if (response.status == 200) {

    return response.data;

  }

  return;

}