import { api } from './axios';
import { 
  CreateUserDto, 
  UpdateUserDto,
  ExtendedUser,
  FullUserInfo 
} from '../../../backend/src/common/types';

export async function getAll(): Promise<ExtendedUser[]> {
  const response = await api.get('/users');
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function create(newUser: CreateUserDto): Promise<ExtendedUser | undefined> {
  const response = await api.post('/users/', newUser);
  if (response.status === 201) {
    return response.data;
  }
  return;
}

export async function get(id: number): Promise<ExtendedUser | undefined> {
  const response = await api.get(`/users/${id}`);
  if (response.status === 200) {
    return response.data;
  }
  return;
}

export async function update(
  id: number,
  payload: UpdateUserDto
): Promise<ExtendedUser | undefined> {
  const response = await api.patch(`/users/${id}`, payload);
  if (response.status === 200) return response.data;
  return;
}

export async function getCurrentUser(): Promise<FullUserInfo | undefined> {
  const response = await api.get('/users/me');
  if (response.status === 200) return response.data;
  return;
}

export async function updateProfile(payload: UpdateUserDto): Promise<FullUserInfo | undefined> {
  const response = await api.patch('/users/me', payload);
  if (response.status === 200) return response.data;
  return;
}

export async function uploadAvatar(file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if (response.status === 200) return response.data.avatarUrl;
  return;
}

export async function deleteAvatar(): Promise<void> {
  await api.delete('/users/me/avatar');
}