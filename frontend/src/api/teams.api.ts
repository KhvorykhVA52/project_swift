import { api } from './axios';
import { Team } from '../../../backend/src/orm/team.entity';
import { CreateTeamDto } from '../../../backend/src/common/dto/create-team.dto';
import { AddToTeamDto } from '../../../backend/src/common/dto/add-to-team.dto';

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
  const response = await api.post('/teams/create/' + id, newteam);

  if (response.status  == 201){
    return 'OK'
  }

  return 'Error';

}

export async function AddInByOne(
  
  data: AddToTeamDto
  
): Promise<string> {

  const response = await api.post('/teams/addinbyone', data);

  if (response.status  == 201){
    return 'OK';
  }

  return 'Error';

}