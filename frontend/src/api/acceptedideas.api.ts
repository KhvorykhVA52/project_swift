import { api } from './axios';

export async function getAll() {
    try {
        const response = await api.get('ideas/getallaccepted');
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.error('Ошибка при получении идей:', error);
        return null;
    }
}

export async function getAllTeams() {
    try {
        const response = await api.get('teams/getallteams');
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.error('Ошибка при получении команд:', error);
        return null;
    }
}

export async function createInvite(input: {ideaId: number, teamId: number, isInitiatorInviter: boolean}) {
    try {
        const response = await api.post('ideas/invite/create', input);
        return response?.data ?? null;
    } catch (error) {
        console.error('Ошибка при создании приглашения:', error);
        return null;
    }
}

export async function getInvitesBy(id: number) {
    try {
        const response = await api.get(`ideas/invite/getby/${id}`);
        return response?.data ?? null;
    } catch (error) {
        console.error('Ошибка при получении приглашений:', error);
        return null;
    }
}

export async function cancelInvite(id: number) {
    try {
        const response = await api.delete(`ideas/invite/cancelinvite/${id}`);
        return response?.data ?? null;
    } catch (error) {
        console.error('Ошибка при отмене приглашения:', error);
        return null;
    }
}

export async function responseInvite(id: number, status: string) {
    try {
        const response = await api.post(`ideas/invite/responseinvite/${id}`, { response: status });
        return response?.data ?? null;
    } catch (error) {
        console.error('Ошибка при ответе на приглашение:', error);
        return null;
    }
}