import { Role } from '../enums/role.enum';

export type TokenType = 'access' | 'refresh';

export type AuthJwtPayload = {
  sub: string;
  email: string;
  role: Role;
  tokenType: TokenType;
};

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: Role;
};