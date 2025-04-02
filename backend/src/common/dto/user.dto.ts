import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role, UserAccountStatus } from '../types'; // Убедитесь, что путь к типам правильный

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsOptional()
    @IsEnum(Role, { each: true }) // Проверка каждого элемента массива
    roles?: Role[];

    @IsOptional()
    @IsEnum(UserAccountStatus)
    status?: UserAccountStatus;
}

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsEnum(Role, { each: true }) // Проверка каждого элемента массива
    roles?: Role[];

    @IsOptional()
    @IsEnum(UserAccountStatus)
    status?: UserAccountStatus;
}

export class SearchUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsEnum(Role, { each: true }) // Проверка каждого элемента массива
    roles?: Role[];

    @IsOptional()
    @IsEnum(UserAccountStatus)
    status?: UserAccountStatus;
}