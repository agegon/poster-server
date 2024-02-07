import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
