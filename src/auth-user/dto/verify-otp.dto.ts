import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @ApiProperty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public userId: string;
}
