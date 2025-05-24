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

export async function responseToInvite(inviteId: number, response: 'Принято' | 'Отклонено', userId: number) {
    try {
	const status = (response=='Принято');
        const result = await api.put(`teams/invite/respond/${inviteId}`, { userId: userId, accept: status});
        return result?.data ?? null;
    } catch (error) {
        console.log('Ошибка при ответе на приглашение:', error);
        return null;
    }
}