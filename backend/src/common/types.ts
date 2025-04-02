export enum Role {

    admin = 'admin',
  
    user = 'user',
  
  }
  
  export enum UserCommandStatus {
    inTeam = 'In the team',
    expelled = 'Expelled',
  }
      
  export enum StatusProject {
    searchTeam = 'Search for team',
    teamFound = 'Team found',
  }
      
  export enum StatusIdea {
    new = 'New',
    underEditing = 'Under Editing',
    underApproval = 'Under Approval',
    approved = 'Approved',
    published = 'Published',
  }
      
  export enum StatusTeam {
    searchProject = 'Search for a project',
    inProgress = 'In progress',
  }
      
  export enum PrivacyTeam {
    open = 'Open',
    close = 'Close',
  }
      
  export enum Competence {
    no = 'No',
    html = 'HTML',
    typescript = 'TypeScript',
    postgresql = 'PostgeSQL',
  }
  
  export enum UserAccountStatus {
  
    active = 'active',
  
    pending = 'pending',
  
    inactive = 'inactive',
  
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
  
    firstname: string;
  
    lastname: string;
  
    password: string;
  
    roles: Role[];
  
    status: UserAccountStatus;
  
  }
  
   
  
  export type UpdateUserDto = Omit<CreateUserDto, 'password'>;
  
   
  
  export type SecuredUser = {
  
    id: number;
  
    email: string;
  
    firstname: string;
  
    lastname: string;
  
    roles: Role[];
  
    status: UserAccountStatus;
  
  };
  export enum TaskStatus {

    new = 'new',
  
    inProgress = 'inProgress',
  
    done = 'done',
  
  }
  
   
  
  export type TaskDto = {
  
    id: number;
  
    title: string;
  
    status: TaskStatus;
  
    createdAt: Date;
  
    author: SecuredUser;

    assignee?: any;
  
  };
  

  export type CreateProjectDto = {

    title: string;
    description: string;
    
  }

  export type SecuredProject = {
  
    id: number;
    title: string;
    description: string;
  
  };
   
  
  export type CreateUpdateTaskDto = Omit<TaskDto, 'id' | 'createdAt' | 'author'>;