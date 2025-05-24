/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';

export const projectController = {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId

      const projects = await prisma.project.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          users: true,
          issues: true,
        },
      });

      if (projects.length === 0) {
        return next(
          AppError.notFound(`No projects found for user with ID ${userId}`),
        );
      }

      res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  },
};
