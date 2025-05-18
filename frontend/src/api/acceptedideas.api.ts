import { api } from './axios';
//import { StatusIdea } from '../../../backend/src/common/types';

export async function getAll() {
    const response = await api.get('ideas/getallaccepted');

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function getAllTeams() {
    const response = await api.get('teams/getallteams');

    if (response.status == 200) {
        return response.data;
    }

    return null;
}

export async function createInvite(input: {ideaId: number, teamId: number, isInitiatorInviter: boolean}) {
    const response = await api.post('ideas/invite/create', input)

    if (response) {
        return response.data;
    }

    return null;
}

export async function getInvitesBy(id: number) {
    const response = await api.get('ideas/invite/getby/' + id);

    if (response) {
        return response.data;
    }

    return null;
}

export async function cancelInvite(id: number) {
    const response = await api.delete('ideas/invite/cancelinvite/' + id);

    if (response) {
        return response.data;
    }

    return null;
}

export async function responseInvite(id: number, response: string) {
    const responseBackend = await api.post('ideas/invite/responseinvite/' + id, {data: {response: response}});

    if (responseBackend) {
        return responseBackend.data;
    }

    return null;
}

export async function updateStack(id: number, stack: string[]) {
    const response = await api.post('ideas/updatestack/' + id, {stack: stack});

    if (response.status == 201) {
        return response.data;
    }

    return null;
}

export async function getStack(id: number) {
    const response = await api.get('ideas/getstack/' + id);

    if (response.status == 200) {
        return response.data;
    }

    return null;
}