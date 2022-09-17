import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async signup(dto: AuthSignupDto) {
    try {
      const passwordHash = await argon.hash(dto.password);
      dto.password = passwordHash;

      const user = await this.prismaService.user.create({
        data: dto,
      });
      delete user.password;
      return user;
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
    delete user.password;
    return user;
  }
}
