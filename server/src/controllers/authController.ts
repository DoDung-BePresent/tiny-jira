/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import { generateTokens } from '../utils/jwt';

export const authController = {
  async accessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      const token = generateTokens({
        userId,
      });

      res.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  },
};
