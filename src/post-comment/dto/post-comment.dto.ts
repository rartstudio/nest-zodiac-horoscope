import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostCommentDto {
  @IsNotEmpty()
  @ApiProperty()
  public content: string;
}
