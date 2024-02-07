import { IUserSchema } from 'src/user/user.interfaces';

export interface IArticleSchema {
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

export interface IArticlesResponseSchema {
  articles: IArticleSchema[];
  articlesCount: number;
}

export interface IArticleResponseSchema {
  article: IArticleSchema;
}
