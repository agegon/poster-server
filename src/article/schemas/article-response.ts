import { ApiProperty } from '@nestjs/swagger';
import { ArticleSchema } from './article';

export class ArticleResponseSchema {
  @ApiProperty({
    description: 'The article',
    type: ArticleSchema,
  })
  article: ArticleSchema;
}
