import { User } from '@prisma/client';

export interface ISign extends Pick<User, 'email' | 'password'> {
  confirmPassword?: string;
}

export interface ISignUp extends Pick<User, 'name' | 'email' | 'password'> {
  confirmPassword?: string;
}
