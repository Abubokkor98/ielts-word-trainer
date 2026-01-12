import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

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

  it('should limit the number of refresh tokens to 5', async () => {
    const user = {
      _id: '123',
      role: 'user',
      refreshToken: ['old1', 'old2', 'old3', 'old4', 'old5'],
      save: jest.fn().mockResolvedValue(true),
    } as any;

    await AuthService.generateTokens(user);

    expect(user.refreshToken.length).toBe(5);
    // Should have removed 'old1' and added the new one
    expect(user.refreshToken[0]).toBe('old2');
    expect(user.save).toHaveBeenCalled();
  });
});
