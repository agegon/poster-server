import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@mail.com',
  })
  email: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({
    description: 'Password of the user',
  })
  password: string;
}
