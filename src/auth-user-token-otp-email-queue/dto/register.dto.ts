import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { Match } from '../../match.decorator';

export class RegisterDto extends PickType(UserDto, [
  'username',
  'countryCode',
  'email',
  'password',
  'email',
  'phoneNumber',
  'name',
]) {
  @Match('password')
  @ApiProperty()
  public passwordConfirm: string;
}
