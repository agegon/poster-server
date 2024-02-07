import { ApiProperty } from '@nestjs/swagger';

import { ArticleSchema } from './article';

export class ArticlesResponseSchema {
  @ApiProperty({
    description: 'List of the articles',
    type: [ArticleSchema],
  })
  articles: ArticleSchema[];

  @ApiProperty({
    description: 'Number of articles',
    example: 12,
  })
  articlesCount: number;
}
