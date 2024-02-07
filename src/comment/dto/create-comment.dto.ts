import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The main content of the comment',
    example: 'Lorem ipsum dolor sit amet...',
  })
  body: string;
}
