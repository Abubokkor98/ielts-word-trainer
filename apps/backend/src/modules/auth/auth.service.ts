import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@ielts/shared';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import type { IAdmin } from '../admin/admin.model';
import type { IUser } from '../users/users.model';

type AuthEntity = IUser | IAdmin;

export class AuthService {
  static async generateTokens(
    user: AuthEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = {
      id: user._id,
      role: user.role,
      tokenType: 'access',
    };
    const refreshTokenPayload = {
      id: user._id,
      role: user.role,
      tokenType: 'refresh',
    };

    const accessToken = jwt.sign(accessTokenPayload, env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Store in DB
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    // Limit active sessions to 5
    const MAX_SESSIONS = 5;
    if (user.refreshToken.length >= MAX_SESSIONS) {
      // Remove oldest tokens to maintain limit (keep last MAX_SESSIONS - 1)
      user.refreshToken = user.refreshToken.slice(-(MAX_SESSIONS - 1));
    }

    user.refreshToken.push(hashedToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  static async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  static async logout(user: AuthEntity, token: string): Promise<void> {
    const validTokens = [];
    for (const t of user.refreshToken) {
      if (!(await bcrypt.compare(token, t))) {
        validTokens.push(t);
      }
    }
    user.refreshToken = validTokens;
    await user.save();
  }
}
