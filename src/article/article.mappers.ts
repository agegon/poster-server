import { mapUserSchema } from 'src/user/user.mappers';
import { Article } from './article.entity';
import { ArticleSchema } from './schemas/article';

export const mapArticleSchema = (
  article: Article,
  currentUserEmail?: string,
): ArticleSchema => {
  return {
    author: mapUserSchema(article.author),
    body: article.body,
    createdAt: article.createdAt.toISOString(),
    description: article.description,
    favorited: currentUserEmail
      ? article.favorite.some((user) => user.email === currentUserEmail)
      : false,
    favoritesCount: article.favorite.length,
    id: article.id,
    slug: article.slug,
    tags: article.tags.map((tag) => tag.name),
    title: article.title,
    updatedAt: article.updatedAt.toISOString(),
  };
};
