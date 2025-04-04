import { IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(0, 500)
  description?: string;
}