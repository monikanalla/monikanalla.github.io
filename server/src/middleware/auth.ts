import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { AdminUser, type IAdminUser } from '../models/AdminUser.model';
import { httpError } from './error';
import { asyncHandler } from '../utils/asyncHandler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: IAdminUser;
    }
  }
}

export function signToken(adminId: string): string {
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ sub: adminId }, env.JWT_SECRET, options);
}

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw httpError(401, 'Authentication required');
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  } catch {
    throw httpError(401, 'Session expired — please sign in again');
  }

  if (!payload.sub) {
    throw httpError(401, 'Invalid session');
  }

  const admin = await AdminUser.findById(payload.sub);
  if (!admin) {
    throw httpError(401, 'This admin account no longer exists');
  }

  req.admin = admin;
  next();
});
