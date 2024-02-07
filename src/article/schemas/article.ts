import { ApiProperty } from '@nestjs/swagger';
import { UserSchema } from 'src/user/schemas/user';

export class ArticleSchema {
  @ApiProperty({
    description: 'The author of the article',
  })
  author: UserSchema;

  @ApiProperty({
    description: 'ISO formatted date when the article created',
    example: '2022-11-29T11:38:51.999Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Main content of the article',
    example: 'Lorem ipsum dolor sit amet...',
  })
  body: string;

  @ApiProperty({
    description: 'Short description of the article',
    example: 'Description',
  })
  description: string;

  @ApiProperty({
    description: 'Is the article favorite for current user',
    example: false,
  })
  favorited: boolean;

  @ApiProperty({
    description: 'Count of users, who added the article to favorites',
    example: 12,
  })
  favoritesCount: number;

  @ApiProperty({
    description: 'Article ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Short string identifier of the article',
    example: 'example-of-the-article-12',
  })
  slug: string;

  @ApiProperty({
    description: 'Tags of the article',
    example: ['tag-1', 'tag-2'],
  })
  tags: string[];

  @ApiProperty({
    description: 'Title of the article',
    example: 'Example of the article',
  })
  title: string;

  @ApiProperty({
    description: 'ISO formatted date when the article updated',
    example: '2022-11-29T11:38:51.999Z',
  })
  updatedAt: string;
}
