import { api } from './axios';
import {
  CreateUserDto,
  UpdateUserDto,
  ExtendedUser,
  FullUserInfo
} from '../../../backend/src/common/types';
import { AxiosError } from 'axios';

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

  try {
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data,
    });

    if (response.status === 200) {
      // Обрабатываем разные возможные форматы ответа
      return response.data?.avatarUrl || 
             response.data?.url || 
             response.data?.path || 
             `/uploads/avatars/${response.data?.filename}`;
    }
    return undefined;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Full upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Ошибка загрузки аватара');
    }
    throw error;
  }
}

export async function deleteAvatar(): Promise<void> {
  try {
    await api.delete('/users/me/avatar');
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Delete avatar error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else if (error instanceof Error) {
      console.error('Delete error:', error.message);
    } else {
      console.error('Unknown delete error:', error);
    }
    throw error;
  }
}
