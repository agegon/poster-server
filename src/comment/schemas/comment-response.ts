import { ApiProperty } from '@nestjs/swagger';
import { CommentSchema } from './comment';

export class CommentResponseSchema {
  @ApiProperty({
    description: 'The comment',
  })
  comment: CommentSchema;
}
