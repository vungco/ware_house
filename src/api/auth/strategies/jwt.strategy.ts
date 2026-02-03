// strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/api/users/users.service';
import { env } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET || 'warehouse_secret',
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User không tồn tại');
        }

        return user;
    }
}
