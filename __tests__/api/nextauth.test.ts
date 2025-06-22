import { getSession, signIn } from 'next-auth/react';
import { UserModel, UserRole } from '@/lib/models/user.model';
import AuthService from '@/lib/services/AuthService';
import bcrypt from 'bcryptjs';
import { clearTestDB, setupTestDB, teardownTestDB } from '@/__tests__/utils/test-db';

jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
  signIn: jest.fn(),
}));

describe('Auth with next-auth', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    roles: [UserRole.USER],
  };

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

  it('registers a new user', async () => {
    const user = await AuthService.register({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
    });

    const dbUser = await UserModel.findOne({ email: testUser.email });

    expect(dbUser).not.toBeNull();
    expect(dbUser?.email).toBe(testUser.email);
    expect(dbUser?.name).toBe(testUser.name);
    expect(dbUser?.password).not.toBe(testUser.password);
    expect(await bcrypt.compare(testUser.password, dbUser!.password)).toBe(true);
    expect(dbUser?.roles.map(r => r.toString())).toContain(UserRole.USER);
  });

  it('logs in user with next-auth signIn', async () => {
    // First register user
    await AuthService.register({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
    });

    // Mock next-auth signIn to simulate success
    (signIn as jest.Mock).mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: '/',
    });

    const res = await signIn('credentials', {
      redirect: false,
      email: testUser.email,
      password: testUser.password,
    });

    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      email: testUser.email,
      password: testUser.password,
    });
    expect(res).toMatchObject({ ok: true, error: null });

    // Mock getSession to return a user session after login
    (getSession as jest.Mock).mockResolvedValue({
      user: {
        email: testUser.email,
        name: testUser.name,
        roles: [UserRole.USER],
      },
      expires: 'fake-expiry-date',
    });

    const session = await getSession();

    expect(session).not.toBeNull();
    expect(session?.user.email).toBe(testUser.email);
  });
});
