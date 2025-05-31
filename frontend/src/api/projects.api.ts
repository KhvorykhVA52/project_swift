import { api } from './axios';
import { CreateProjectDto } from '../../../backend/src/common/types';



export async function create(

  newProject: CreateProjectDto

): Promise<number> {

  const response = await api.post('/projects/', newProject);

  if (response.status  == 201){
    return 1
  }

  return 0;

}

export async function getAll(): Promise<CreateProjectDto[]> {

  const response = await api.get('/projects/');

  if (response.status == 200) {

    return response.data;

  }

  return [];

}