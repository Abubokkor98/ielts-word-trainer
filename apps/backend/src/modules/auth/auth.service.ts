import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { IUser } from '../users/users.model';

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@ielts/shared';

export class AuthService {
  static async generateTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { id: user._id, role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Store in DB
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken.push(hashedToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  static async validatePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async logout(user: IUser, token: string): Promise<void> {
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
