import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  body: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString({ each: true })
  tags: string[] = [];
}
