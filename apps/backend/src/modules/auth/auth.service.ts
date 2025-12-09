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
    user.refreshToken.push(refreshToken);
    // Ideally hash this token before storing: await bcrypt.hash(refreshToken, 10);
    // For now we store plain to keep simple but secure-ish with HTTPS
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
    user.refreshToken = user.refreshToken.filter((t) => t !== token);
    await user.save();
  }
}
