import { ApiProperty } from '@nestjs/swagger';

export class ProfileSchema {
  @ApiProperty({
    description: 'Short information about the user',
    example: 'Lorem ipsum dolor sit amet...',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'Is user in favorites',
    example: false,
  })
  following: boolean;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Image of the user',
    example: 'http://source.com/avatar.png',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'user',
  })
  username: string;
}
