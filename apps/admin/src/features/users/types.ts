import type { User } from '../../../types/user';

export type { User };

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
