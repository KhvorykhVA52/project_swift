export enum Role {
  admin = 'admin',
  user = 'user',
}

export enum UserAccountStatus {
  active = 'active',
  pending = 'pending',
  inactive = 'inactive',
}

export enum TaskStatus {
  new = 'new',
  inProgress = 'inProgress',
  done = 'done',
}

export enum StatusIdea {
  new = 'Новое',
  underEditing = 'Дорабатывается',
  underApproval = 'Ожидает проверки',
  approved = 'Утверждено',
  deny = 'Отклонено',
  underDiscussion = 'Обсуждается',
}

export enum StatusProject {
  searchTeam = 'Search for team',
  teamFound = 'Team found',
}

export enum Competence {
  no = 'No',
  html = 'HTML',
  typescript = 'TypeScript',
  postgresql = 'PostgreSQL',
}

export interface SecuredUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  status: UserAccountStatus;
}

export interface ExtendedUser extends SecuredUser {
  group: string;
  telephone: string;
}

export interface FullUserInfo extends ExtendedUser {
  avatarUrl: string;
  createdAt: Date;
}

export interface LoginResponseDto {
  userId: number;
  access_token: string;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
}

export interface SignUpRequestDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface SignupResponseDto {
  success: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  roles?: Role[];
  status?: UserAccountStatus;
  group?: string;
  telephone?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: Role[];
  status?: UserAccountStatus;
  group?: string;
  telephone?: string;
}
export interface TaskDto {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  author: SecuredUser;
  assignee?: SecuredUser; 
}

export type CreateUpdateTaskDto = Omit<TaskDto, 'id' | 'createdAt' | 'author'>;

export interface CreateProjectDto {
  title: string;
  description: string;
}

export interface SecuredProject {
  id: number;
  title: string;
  description: string;
}