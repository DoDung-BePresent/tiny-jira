/**
 * Node modules
 */
import { IssueStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';

export const issueController = {
  async updateIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, listPosition } = req.body;

      if (!Object.values(IssueStatus).includes(status)) {
        next(AppError.badRequest('Invalid issue status'));
      }

      const updatedIssue = await prisma.issue.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status,
          listPosition,
          updatedAt: new Date(),
        },
        include: {
          users: {
            select: {
              id: true,
              avatarUrl: true,
              name: true,
            },
          },
        },
      });

      res.json({
        data: updatedIssue,
        message: 'Issue updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
