import { UserService } from './UserService';
import { authConfig } from '@/lib/config/auth.config';
import { getServerSession } from 'next-auth/next'

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


  async getCurrentUser(req: Request) {
    // Fix: spread req and add undefined for res to satisfy Pages Router overload
    // This ensures the param matches [NextApiRequest, NextApiResponse, AuthOptions] tuple
    // if running in Pages Router context. If App Router, pass { req } only.
    // Adjust based on the environment, here forcing Pages Router style:
    const session = await getServerSession(req as any, undefined as any, authConfig)

    if (!session?.user) return null

    const userId = (session.user as any).id
    if (!userId) return null

    const user = await this.userService.findById(userId)
    return user
  }


  async logout() {
    // next-auth signout is client-side or API call to /api/auth/signout
    // Here, just a placeholder or can clear cookie/token if manual
    return true;
  }
}

export default new AuthService();
