import bcrypt from 'bcryptjs';
import type { CreateUserInput } from '../../shared';
import { type IUser, User } from './users.model';

export class UserService {
  static async createUser(input: CreateUserInput): Promise<IUser> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await User.create({
      ...input,
      passwordHash,
    });

    return user;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  static async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  static async findOne(filter: any): Promise<IUser | null> {
    return User.findOne(filter);
  }
}
