import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly jwtStrategy: JwtRefreshStrategy) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      await super.canActivate(context);
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
