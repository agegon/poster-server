import { ApiProperty } from '@nestjs/swagger';
import { UserSchema } from './user';

export class UserResponseSchema {
  @ApiProperty({
    description: 'Authorization token',
    example: '',
  })
  token: string;

  @ApiProperty({
    description: 'The user info',
  })
  user: UserSchema;
}
