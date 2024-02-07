import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Username of the user',
    example: 'user',
    required: false,
  })
  username: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@mail.com',
    required: false,
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    description: 'Current password of the user',
    required: false,
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    description: 'New password of the user',
    required: false,
  })
  newPassword: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Short information about the user',
    example: 'Lorem ipsum dolor sit amet...',
    required: false,
  })
  bio: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Username of the user',
    example: 'user',
    required: false,
  })
  image: string;
}
