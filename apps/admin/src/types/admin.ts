export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  updatedAt?: string;
}
