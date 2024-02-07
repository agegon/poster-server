import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { toBoolean, toNumber } from 'src/utils/transformers';

export class GetAllArticlesDto {
  @IsOptional()
  @IsString()
  author: string;

  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  favorited: boolean;

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
