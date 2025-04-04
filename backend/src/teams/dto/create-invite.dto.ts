import { IsNumber } from 'class-validator';

export class CreateInviteDto {
  @IsNumber()
  inviteeId: number;

  @IsNumber()
  teamId: number;
}