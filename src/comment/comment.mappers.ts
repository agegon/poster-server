import { mapUserSchema } from 'src/user/user.mappers';
import { Comment } from './comment.entity';
import { CommentSchema } from './schemas/comment';

export const mapCommentSchema = (comment: Comment): CommentSchema => {
  return {
    author: mapUserSchema(comment.author),
    body: comment.body,
    id: comment.id,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
};
