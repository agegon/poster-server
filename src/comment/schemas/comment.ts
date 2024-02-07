import { ApiProperty } from '@nestjs/swagger';
import { UserSchema } from 'src/user/schemas/user';

export class CommentSchema {
  @ApiProperty({
    description: 'The author of the comment',
  })
  author: UserSchema;

  @ApiProperty({
    description: 'The main content of the comment',
    example: 'Lorem ipsum dolor sit amet...',
  })
  body: string;

  @ApiProperty({
    description: 'ISO formatted date when the comment created',
    example: '2022-11-29T11:38:51.999Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Comment ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ISO formatted date when the comment updated',
    example: '2022-11-29T11:38:51.999Z',
  })
  updatedAt: string;
}
