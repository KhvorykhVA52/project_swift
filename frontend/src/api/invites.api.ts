import { api } from './axios';

export async function getInvites(id: number) {
    console.log('teams/user/invites/' + id);
    const response = await api.get('teams/user/invites/' + id);

    if (response.status == 200) {
        return response.data;
    }

    return null;
}