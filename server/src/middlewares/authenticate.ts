/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw AppError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(AppError.unauthorized('Invalid token'));
  }
};
