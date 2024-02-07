import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Main content of the article',
    example: 'Lorem ipsum dolor sit amet...',
    required: false,
  })
  body: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Short description of the article',
    example: 'Description',
    required: false,
  })
  description: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Title of the article',
    example: 'Example of the article',
    required: false,
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
