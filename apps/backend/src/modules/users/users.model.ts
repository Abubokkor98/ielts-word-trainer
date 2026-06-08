import mongoose, { type Document, Schema } from 'mongoose';
import { UserRole } from '../../shared';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'banned';
  profilePictureUrl?: string;
  profilePictureId?: string;
  refreshToken: string[];
  xp: number;
  streak: number;
  lastQuizDate?: Date;
  lastReviewDate?: Date;
  timezone?: string;
  lastStreakCheckDate?: Date;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    refreshToken: { type: [String], default: [] },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastQuizDate: { type: Date },
    lastReviewDate: { type: Date },
    timezone: { type: String },
    lastStreakCheckDate: { type: Date },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    profilePictureUrl: { type: String, default: null },
    profilePictureId: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User =
  mongoose.models['User'] || mongoose.model<IUser>('User', UserSchema);
