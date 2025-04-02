export class CreateProjectDto {  
    title: string;  
    description?: string;  
    ownerId: number; 
  }  
  
  export class UpdateProjectDto {  
    title?: string;  
    description?: string;  
    status?: 'draft' | 'active' | 'archived';  
  }  