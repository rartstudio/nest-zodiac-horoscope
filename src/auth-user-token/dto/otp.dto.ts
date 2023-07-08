import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  public otp: string;
}
