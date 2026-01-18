import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import { AdminRole } from '../../shared';
import type { AuthRequest } from '../auth/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { AdminService } from './admin.service';
import { CSVExportService } from './csv-export.service';

export class AdminController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const admin = await AdminService.findByEmail(email);

      if (!admin) {
        throw new AppError('Invalid email or password', 401);
      }

      const isValid = await AuthService.validatePassword(
        password,
        admin.passwordHash
      );

      if (!isValid) {
        throw new AppError('Invalid email or password', 401);
      }

      const { accessToken, refreshToken } = await AuthService.generateTokens(
        admin
      );

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
        domain: cookieDomain,
      };

      res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 3600000, // 7 days
      });

      res.status(200).json({
        success: true,
        accessToken,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const admin = await AdminService.findById(authReq.user.id);
      if (!admin) throw new AppError('Admin not found', 404);

      res.json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await AdminService.findAll();
      res.json({
        success: true,
        data: admins,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;

      const result = await AdminService.getUsers(page, limit, search);

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'banned', 'inactive'].includes(status)) {
        throw new AppError('Invalid status', 400);
      }

      await AdminService.updateUserStatus(id, status);

      res.json({
        success: true,
        message: 'User status updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async exportUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const csvContent = await CSVExportService.exportUsers();

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');

      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (authReq.user?.role !== AdminRole.SUPER_ADMIN) {
        throw new AppError('Unauthorized', 403);
      }

      const { email, password, name, role } = req.body;

      if (role && !Object.values(AdminRole).includes(role)) {
        throw new AppError('Invalid role', 400);
      }

      const existingAdmin = await AdminService.findByEmail(email);
      if (existingAdmin) {
        throw new AppError('Admin with this email already exists', 400);
      }

      const admin = await AdminService.createAdmin(
        {
          email,
          name,
          role: role || AdminRole.ADMIN,
        },
        password
      );

      res.status(201).json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;

      const { id } = req.params;
      if (id === authReq.user.id) {
        throw new AppError('Cannot delete yourself', 400);
      }

      await AdminService.deleteAdmin(id);

      res.json({
        success: true,
        message: 'Admin deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const _authReq = req as AuthRequest;

      const { id } = req.params;
      const data = req.body;

      // Prevent updating password via this endpoint for now or handle it if needed
      if (data.password) {
        // If password update logic is needed it should happen here or in service
        delete data.password;
      }

      // Never allow direct passwordHash manipulation via generic update
      if (data.passwordHash) {
        delete data.passwordHash;
      }

      // Optional: validate role changes
      if (data.role && !Object.values(AdminRole).includes(data.role)) {
        throw new AppError('Invalid role', 400);
      }

      const admin = await AdminService.updateAdmin(id, data);

      if (!admin) throw new AppError('Admin not found', 404);

      res.json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const adminId = authReq.user?.id;

      if (!adminId) {
        throw new AppError('Unauthorized', 401);
      }

      const { name } = req.body;
      const admin = await AdminService.updateAdmin(adminId, { name });

      if (!admin) {
        throw new AppError('Admin not found', 404);
      }

      res.json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const adminId = authReq.user?.id;

      if (!adminId) {
        throw new AppError('Unauthorized', 401);
      }

      const { currentPassword, newPassword } = req.body;

      if (
        !newPassword ||
        typeof newPassword !== 'string' ||
        newPassword.length < 6
      ) {
        throw new AppError('Password must be at least 6 characters', 400);
      }

      // Get admin with password
      const admin = await AdminService.findById(adminId);
      if (!admin) {
        throw new AppError('Admin not found', 404);
      }

      // Verify current password
      const isValid = await AuthService.validatePassword(
        currentPassword,
        admin.passwordHash
      );

      if (!isValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Update password
      await AdminService.updatePassword(adminId, newPassword);

      res.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError('Refresh token not found', 401);
      }

      // Verify refresh token
      const decoded = await AuthService.verifyToken(refreshToken);
      const admin = await AdminService.findById(decoded.id);

      if (!admin) {
        throw new AppError('Admin not found', 401);
      }

      // Check if refresh token exists in admin's token list
      let tokenValid = false;
      for (const storedToken of admin.refreshToken) {
        const isMatch = await AuthService.validatePassword(
          refreshToken,
          storedToken
        );
        if (isMatch) {
          tokenValid = true;
          break;
        }
      }

      if (!tokenValid) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Token rotation: Generate new tokens and invalidate old refresh token
      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.generateTokens(admin);

      // Remove old refresh token
      await AuthService.logout(admin, refreshToken);

      // Set new tokens with proper cookie configuration
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
        domain: cookieDomain,
      };

      res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 3600000, // 7 days
      });

      res.json({
        success: true,
        accessToken,
      });
    } catch (err) {
      // Clear invalid refresh token
      res.clearCookie('refreshToken');
      next(err);
    }
  }
}
