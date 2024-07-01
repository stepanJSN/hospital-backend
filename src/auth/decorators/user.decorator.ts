import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type JWTPayload = {
  uid: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof JWTPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
