import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(1)
  body: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  slug: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString({ each: true })
  tags: string[] = [];
}
