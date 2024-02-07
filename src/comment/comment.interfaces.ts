import { IUserSchema } from 'src/user/user.interfaces';

export interface ICommentSchema {
  author: IUserSchema;
  body: string;
  createdAt: string;
  id: number;
  updatedAt: string;
}

export interface ICommentResponseSchema {
  comment: ICommentSchema;
}

export interface ICommentsResponseSchema {
  comments: ICommentSchema[];
}
