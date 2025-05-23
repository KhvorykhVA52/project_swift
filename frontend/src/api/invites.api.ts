import { api } from './axios';

export async function getInvites(userId: number) {
    try {
        const response = await api.get(`teams/user/invites/${userId}`);
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.error('Ошибка при получении приглашений:', error);
        return null;
    }
}

export async function responseToInvite(inviteId: number, response: 'Принято' | 'Отклонено') {
    try {
        const result = await api.post(`teams/invite/response/${inviteId}`, { status: response });
        return result?.data ?? null;
    } catch (error) {
        console.error('Ошибка при ответе на приглашение:', error);
        return null;
    }
}