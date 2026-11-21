import bcrypt from 'bcryptjs';
import { Schema, model, type Document, type Model } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    mustChangePassword: { type: Boolean, default: true },
  },
  { timestamps: true },
);

adminUserSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const AdminUser: Model<IAdminUser> = model<IAdminUser>('AdminUser', adminUserSchema);

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
