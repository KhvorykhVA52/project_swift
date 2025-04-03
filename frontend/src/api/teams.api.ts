import { api } from './axios';
import { Team } from '../../../backend/src/orm/team.entity';
import { CreateTeamDto } from '../../../backend/src/common/dto/create-team.dto';

export async function getAll(): Promise<Team[] | string> {

  const response = await api.get('/teams/');

  if (response.status == 200) {

    return response.data;

  }

  return 'Error: no any team found';

}

export async function create(

  id: number,
  newteam: CreateTeamDto

): Promise<string> {
  console.log('/teams/' + id);
  const response = await api.post('/teams/' + id, newteam);

  if (response.status  == 201){
    return 'OK'
  }

  return 'Error: response.status is no 201 at create() in teams.api';

}

export async function AddInByOne(

  id: number[]

): Promise<string> {

  const response = await api.post('/teams/AddInByOne', id);

  if (response.status  == 201){
    return response.data;
  }

  return 'Error: response.status is no 201 at AddInByOne() in teams.api';

}

export async function GetByOwner(

  id: number

): Promise<string> {

  const response = await api.get('/teams/GetByOwner/' + id);

  if (response.status  == 201){
    return 'OK';
  }

  return 'Error: response.status is no 201 at GetByOwner() in teams.api';

}