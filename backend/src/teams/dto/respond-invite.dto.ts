import { IsBoolean } from 'class-validator';

export class RespondInviteDto {
  userId: number;
  accept: boolean;
}

