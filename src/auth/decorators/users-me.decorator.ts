import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsersMeDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
