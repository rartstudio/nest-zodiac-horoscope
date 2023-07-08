import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateEmailUserDto extends PickType(UserDto, ['email']) {
  @IsString()
  @IsNotEmpty({ message: `OTP tidak boleh kosong` })
  @MinLength(6, { message: `OTP harus 6 angka` })
  @ApiProperty()
  public otp: string;
}
