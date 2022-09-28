import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersMeDecorator } from 'src/auth/decorators/users-me.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard) // at this level use guard to controller
@Controller('users')
export class UserController {
  // @UseGuards(JwtGuard): // at this level use guard to endpoint
  @Get('me')
  getMet(@UsersMeDecorator() user: User) {
    return user;
  }
}
