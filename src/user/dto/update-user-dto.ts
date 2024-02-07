import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  newPassword: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  image: string;
}
