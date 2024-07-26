import { Role } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  password: string;
};

export type JWTPayload = User & {
  role: Role;
};
