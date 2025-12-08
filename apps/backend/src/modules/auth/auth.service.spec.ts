import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';

jest.mock('../../config/env', () => ({
  env: { JWT_SECRET: 'test-secret' },
}));

describe('AuthService', () => {
  it('should generate access and refresh tokens', async () => {
    const user = {
      _id: '123',
      role: 'user',
      refreshToken: [],
      save: jest.fn().mockResolvedValue(true),
    } as any;

    const tokens = await AuthService.generateTokens(user);

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(user.save).toHaveBeenCalled();

    const decoded = jwt.verify(tokens.accessToken, 'test-secret') as any;
    expect(decoded.id).toBe('123');
    expect(decoded.role).toBe('user');
  });
});
