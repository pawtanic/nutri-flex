import { setupTestDB, clearTestDB, teardownTestDB } from '../utils/test-db';
import { UserModel, UserRole } from '@/lib/models/user.model';
import AuthService from '@/lib/services/AuthService';
import { GET as getMeHandler } from '@/app/api/auth/me/route';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/config/env.config';

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

const createMockApiRequest = (token: string | null = null): any => {
  return {
    headers: { authorization: token ? `Bearer ${token}` : undefined },
    cookies: {},
  };
};

describe('Authentication', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    roles: [UserRole.USER],
  };

  describe('User Registration', () => {
    it('should register a new user', async () => {
      const user = await AuthService.register({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      });

      // Fetch full mongoose document (no .lean())
      const dbUser = await UserModel.findOne({ email: testUser.email });

      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe(testUser.email);
      expect(dbUser?.name).toBe(testUser.name);
      expect(dbUser?.password).not.toBe(testUser.password);

      // Compare using bcrypt - now works because dbUser.password is a string
      expect(await bcrypt.compare(testUser.password, dbUser!.password)).toBe(true);

      expect(dbUser?.roles.map(r => r.toString())).toContain(UserRole.USER);
    });

    it('should not register a user with an existing email', async () => {
      await UserModel.create({
        ...testUser,
        password: await bcrypt.hash(testUser.password, 12),
      });

      await expect(AuthService.register({
        email: testUser.email,
        password: 'anotherpassword',
        name: 'Another User',
      })).rejects.toThrow();

      const users = await UserModel.find({ email: testUser.email });
      expect(users.length).toBe(1);
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      await AuthService.register({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      });
    });

    it('should login with valid credentials', async () => {
      const result = await AuthService.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result).toHaveProperty('message', 'Login successful');
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.roles).toContain(UserRole.USER);
    });

    it('should not login with wrong password', async () => {
      await expect(AuthService.login({
        email: testUser.email,
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid credentials');
    });

    it('should not login with non-existent user', async () => {
      await expect(AuthService.login({
        email: 'nouser@example.com',
        password: 'anything',
      })).rejects.toThrow('User not found');
    });
  });

  describe('Token Validation', () => {
    it('should return user data when token is valid', async () => {
      const user = await UserModel.create({
        ...testUser,
        password: await bcrypt.hash(testUser.password, 12),
      });

      const mockToken = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
      (getToken as jest.Mock).mockResolvedValue(mockToken);

      const request = createMockApiRequest('valid-token');
      const response = await getMeHandler(request, {} as any);
      const data = await response.json();

      expect(data).toEqual(mockToken);
    });

    it('should return 401 when token is invalid', async () => {
      (getToken as jest.Mock).mockResolvedValue(null);

      const request = createMockApiRequest();
      const response = await getMeHandler(request, {} as any);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.message).toBe('Unauthorized');
    });
  });
});
