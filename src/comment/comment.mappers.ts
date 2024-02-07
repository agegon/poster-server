import { mapUserSchema } from 'src/user/user.mappers';
import { Comment } from './comment.entity';
import { ICommentSchema } from './comment.interfaces';

export const mapCommentSchema = (comment: Comment): ICommentSchema => {
  return {
    author: mapUserSchema(comment.author),
    body: comment.body,
    id: comment.id,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
};
