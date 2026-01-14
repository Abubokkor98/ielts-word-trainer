import { AdminRole } from '@ielts/shared';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  refreshToken: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.ADMIN,
    },
    refreshToken: { type: [String], default: [] },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
