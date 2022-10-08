import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/jwt.guard';
import { UsersMeDecorator } from '../auth/decorators/users-me.decorator';

@UseGuards(JwtGuard) // at this level use guard to controller
@Controller('users')
export class UserController {
  // @UseGuards(JwtGuard): // at this level use guard to endpoint
  @Get('me')
  getMet(@UsersMeDecorator() user: User) {
    return user;
  }
}
