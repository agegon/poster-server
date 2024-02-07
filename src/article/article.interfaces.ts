import { IUserSchema } from 'src/user/user.interfaces';

export interface IArticleResponseSchema {
  author: IUserSchema;
  createdAt: string;
  body: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  id: number;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
}
