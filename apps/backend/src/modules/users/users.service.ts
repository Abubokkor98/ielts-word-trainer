import bcrypt from 'bcryptjs';
import type { CreateUserInput } from '../../shared';
import { type IUser, User } from './users.model';

type Filter = Record<string, unknown>;
type Update = Record<string, unknown>;
type Options = Record<string, unknown>;

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
    return User.findById(id).exec();
  }

  static async isUserVerified(id: string): Promise<boolean> {
    const user = await User.findById(id).select('isEmailVerified').lean().exec();
    return !!user?.isEmailVerified;
  }

  static async findOne(filter: Filter): Promise<IUser | null> {
    return User.findOne(filter).exec();
  }

  static async findOneAndUpdate(
    filter: Filter,
    update: Update,
    options: Options = {}
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(filter, update, options).exec();
  }
}
