export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'banned';
  xp?: number;
  streak?: number;
  lastQuizDate?: string;
  createdAt: string;
}
