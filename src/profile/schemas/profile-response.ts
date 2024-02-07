import { ApiProperty } from '@nestjs/swagger';
import { ProfileSchema } from './profile';

export class ProfileResponseSchema {
  @ApiProperty({
    description: 'The profile',
  })
  profile: ProfileSchema;
}
