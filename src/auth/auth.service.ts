import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { msg: 'i am signup' };
  }

  login() {
    return { msg: 'i am login' };
  }
}
