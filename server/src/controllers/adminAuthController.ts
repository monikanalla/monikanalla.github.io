import type { Request, Response } from 'express';
import { AdminUser, hashPassword } from '../models/AdminUser.model';
import { asyncHandler } from '../utils/asyncHandler';
import { httpError } from '../middleware/error';
import { signToken } from '../middleware/auth';
import { changePasswordSchema, loginSchema } from '../validation/schemas';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await AdminUser.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!admin) throw httpError(401, 'Invalid email or password');

  const valid = await admin.comparePassword(password);
  if (!valid) throw httpError(401, 'Invalid email or password');

  res.json({
    token: signToken(admin.id),
    admin: {
      id: admin.id,
      email: admin.email,
      mustChangePassword: admin.mustChangePassword,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = req.admin;
  if (!admin) throw httpError(401, 'Authentication required');

  res.json({
    id: admin.id,
    email: admin.email,
    mustChangePassword: admin.mustChangePassword,
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const admin = req.admin;
  if (!admin) throw httpError(401, 'Authentication required');

  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  const withHash = await AdminUser.findById(admin._id).select('+passwordHash');
  if (!withHash) throw httpError(401, 'Authentication required');

  const valid = await withHash.comparePassword(currentPassword);
  if (!valid) throw httpError(400, 'Current password is incorrect');

  withHash.passwordHash = await hashPassword(newPassword);
  withHash.mustChangePassword = false;
  await withHash.save();

  res.json({ message: 'Password updated' });
});
