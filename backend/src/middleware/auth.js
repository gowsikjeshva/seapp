import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function protect(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new AppError('Authentication is required.', 401));
  try { const { id } = jwt.verify(header.slice(7), env.jwtSecret); const user = await User.findById(id); if (!user) return next(new AppError('User no longer exists.', 401)); req.user = user; next(); }
  catch { next(new AppError('Invalid or expired authentication token.', 401)); }
}
export const authorize = (...roles) => (req, _res, next) => roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission for this action.', 403));
