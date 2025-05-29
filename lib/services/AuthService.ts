import { UserService } from './UserService';
import { authConfig } from '@/lib/config/auth.config';
import { getServerSession } from 'next-auth/next';
import { IUser } from '@/lib/models/user.model';
import { NextRequest } from 'next/server';

export class AuthService {
  userService = new UserService();

  async register(data: { email: string; password: string; name?: string }) {
    // You need to hash password here (bcrypt)
    return await this.userService.create({
      email: data.email,
      password: data.password, // hash before saving in real code
      name: data.name || '',
      roles: ['user'],
    });
  }

  async login(credentials: { email: string; password: string }) {
    // No direct login here, delegate to NextAuth in route (credentials provider)
    // You could validate manually here if you want
    throw new Error('Use NextAuth credential provider for login');
  }


  async logout() {
    // next-auth signout is client-side or API call to /api/auth/signout
    // Here, just a placeholder or can clear cookie/token if manual
    return true;
  }
}

export default new AuthService();
