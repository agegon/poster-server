import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'src/utils/transformers';

export class GetAllArticlesDto {
  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  favorite_for: string;

  @Transform(toNumber)
  @IsNumber()
  limit = 10;

  @Transform(toNumber)
  @IsNumber()
  offset = 0;

  @IsOptional()
  @IsString()
  tag: string;
}
