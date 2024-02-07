import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Main content of the article',
    example: 'Lorem ipsum dolor sit amet...',
  })
  body: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Short description of the article',
    example: 'Description',
  })
  description: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Title of the article',
    example: 'Example of the article',
  })
  title: string;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Tags of the article',
    example: ['tag-1', 'tag-2'],
    required: false,
  })
  tags: string[] = [];
}
