import { api } from './axios';
import { Team } from '../../../backend/src/orm/team.entity';
import { CreateTeamDto } from '../../../backend/src/common/dto/create-team.dto';
import { AddToTeamDto } from '../../../backend/src/common/dto/add-to-team.dto';
import { SecuredUser } from '../../../backend/src/common/types';
import { CreateInviteDto } from '../../../backend/src/teams/dto/create-invite.dto';

export async function getTeams(id: number): Promise<Team[]|undefined> {

  const response = await api.get('/teams/getteams/' + id);

  if (response.status == 200) {

    return response.data;

  }

  return undefined;
}

export async function create(
  ownerId: number,
  newteam: CreateTeamDto
) {
  const response = await api.post('/teams/create/', {ownerId: ownerId, ...newteam});
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

export async function getAll(): Promise<SecuredUser[]> {

  const response = await api.get('/users');

  if (response.status == 200) {

    return response.data;

  }

  return [];

}

export async function invite(inviterId: number, dto: CreateInviteDto) {
  const response = await api.post('/teams/invite/', {inviterId: inviterId, ...dto});

  if (response.data == 'OK') {
    return 'OK';
  }
  return 'ERROR';
}

export async function getTeamAsMember(id: number) {
  const response = await api.get('/teams/getteamasmember/' + id);

  if (response) {
    return response.data;
  }

  return null;
}