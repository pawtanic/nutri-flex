import { BadRequestError, NotFoundError } from './CrudService';
import { UserService } from './UserService';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/config/env.config';
import { signIn } from 'next-auth/react';

export class AuthService {
  userService = new UserService();

  async register(data: { email: string; password: string; name?: string }) {
    if (!data.email || !data.password) throw new BadRequestError('Email and password required');

    const existing = await this.userService.findByEmail(data.email);
    if (existing) throw new BadRequestError('User already exists');

    const hashed = await bcrypt.hash(data.password, env.SALT);

    return this.userService.create({
      email: data.email,
      password: hashed,
      name: data.name ?? '',
      roles: ['user'],
    });
  }

  async login(credentials: { email: string; password: string }) {
    if (!credentials.email || !credentials.password) throw new BadRequestError('Email and password required');

    const user = await this.userService.findByEmail(credentials.email);
    if (!user) throw new NotFoundError('User not found');
    signIn()

    const match = await bcrypt.compare(credentials.password, user.password);
    if (!match) throw new BadRequestError('Invalid credentials');

    // 🔐 Placeholder for token/session management
    return {
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      // token: generateJWT(user) <- implement when needed
    };
  }

  async logout(): Promise<{ message: string }> {
    // No-op unless you're using JWT or cookies — typically client handles logout
    return { message: 'Logged out (client should clear token/session)' };
  }
}

export default new AuthService();
