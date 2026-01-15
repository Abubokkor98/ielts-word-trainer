import type { UserRole } from '@ielts/shared';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'banned';
  xp: number;
  streak: number;
  lastLoginAt?: string;
  lastQuizDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
