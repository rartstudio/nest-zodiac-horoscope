import { ApiProperty, PickType } from '@nestjs/swagger';
import { Match } from '../../match.decorator';
import { UserDto } from '../../user/dto/user.dto';

export class ResetPasswordDto extends PickType(UserDto, ['password']) {
  @Match('password')
  @ApiProperty()
  public passwordConfirm: string;
}
