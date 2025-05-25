import { hashPassword, verifyPassword } from './auth.service';

describe('AuthService', () => {
  it('should hash a password and verify it correctly', async () => {
    const password = 'superSecret123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrongPassword', hash)).toBe(false);
  });
});
