import { ApiProperty } from '@nestjs/swagger';
import { CommentSchema } from './comment';

export class CommentsResponseSchema {
  @ApiProperty({
    description: 'The list of comments',
    type: [CommentSchema],
  })
  comments: CommentSchema[];
}
