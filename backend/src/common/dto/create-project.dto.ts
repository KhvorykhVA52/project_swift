import { IsNumber, IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { StatusProject } from '../types';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsOptional()
  status?: StatusProject;

  @IsOptional()
  deadline?: Date;
}