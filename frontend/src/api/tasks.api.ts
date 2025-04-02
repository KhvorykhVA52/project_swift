import { api } from './axios';

import {

  CreateUpdateTaskDto,

  SecuredUser,

  TaskDto,

} from '../../../backend/src/common/types';

 

export async function getTasks(): Promise<TaskDto[]> {

  const response = await api.get('/tasks');

  if (response.status == 200) {

    return response.data;

  }

  return [];

}

 

export async function create(

  newUser: CreateUpdateTaskDto

): Promise<string | undefined> {

  const response = await api.post('/tasks', newUser);

  if (response.status == 201) {

    return response.data;

  }

  return;

}

 

export async function update(

  id: number,

  payload: CreateUpdateTaskDto

): Promise<SecuredUser | undefined> {

  const response = await api.patch('/tasks/' + id, payload);

  if (response.status == 200) {

    return response.data;

  }

  return;

}

 

export async function remove(id: number): Promise<SecuredUser | undefined> {

  const response = await api.delete('/tasks/' + id);

  if (response.status == 200) {

    return response.data;

  }

  return;

}
