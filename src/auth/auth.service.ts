import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthSignupDto) {
    try {
      const passwordHash = await argon.hash(dto.password);
      dto.password = passwordHash;

      const user = await this.prismaService.user.create({
        data: dto,
      });
      return await this.jwtSign(user.id, user.username);
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  async login(dto: AuthLoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.jwtSign(user.id, user.username);
  }

  private async jwtSign(userId: number, username: string) {
    const payload = {
      userId: userId,
      username: username,
    };

    const jwtOptions = {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1h',
    };

    return {
      access_token: await this.jwtService.signAsync(payload, jwtOptions),
    };
  }
}
