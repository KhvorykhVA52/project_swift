import { IsBoolean, IsNumber } from 'class-validator';

export class RespondInviteDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  accept: boolean;
}