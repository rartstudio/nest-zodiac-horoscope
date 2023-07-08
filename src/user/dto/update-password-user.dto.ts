import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../match.decorator';
import { UserDto } from './user.dto';

export class UpdatePasswordUserDto extends PickType(UserDto, ['password']) {
  @IsString()
  @Match('password', { message: 'Password harus sama' })
  @ApiProperty()
  public passwordConfirm: string;

  @IsString()
  @MinLength(8, { message: `Password lama minimal harus 8 huruf` })
  @MaxLength(20, {
    message: `Password lama tidak boleh lebih dari 20 karakter`,
  })
  @IsNotEmpty({ message: `Password lama harus diisi` })
  @Matches(/(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password lama harus mengandung huruf besar, huruf kecil, angka, dan simbol',
  })
  @ApiProperty()
  public currentPassword: string;
}
