import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from 'src/utils/transformers';

export class GetFeedArticlesDto {
  @Transform(toNumber)
  @IsNumber()
  limit = 10;

  @Transform(toNumber)
  @IsNumber()
  offset = 0;
}
