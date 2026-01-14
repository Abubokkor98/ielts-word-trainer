export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}
