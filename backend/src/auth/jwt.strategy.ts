import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'wow-web-mmo-secret-key-2026',
    });
  }

  async validate(payload: any) {
    // 临时使用简单的用户对象
    const user = await this.usersService.findByEmail(payload.email);
    return user || { id: payload.sub, email: payload.email };
  }
}
