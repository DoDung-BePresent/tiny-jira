import { ErrorRequestHandler } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError, ErrorType } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): any => {
  // Log error
  console.error(`Error Occurred on PATH: ${req.path} `, error);

  // Xử lý AppError tự định nghĩa
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
      ...(error.errors && { details: error.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Xử lý lỗi Prisma
  if (error instanceof PrismaClientKnownRequestError) {
    // Thực hiện map Prisma error codes sang lỗi có ý nghĩa với client
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return res.status(409).json({
          type: ErrorType.CONFLICT,
          message: `Unique constraint violation on: ${error.meta?.target}`,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          type: ErrorType.NOT_FOUND,
          message: error.meta?.cause || 'Record not found',
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
      case 'P2003': // Foreign key constraint failed
        return res.status(400).json({
          type: ErrorType.VALIDATION,
          message: `Foreign key constraint failed on: ${error.meta?.field_name}`,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
      default:
        return res.status(500).json({
          type: ErrorType.DATABASE_ERROR,
          message: 'Database error occurred',
          ...(process.env.NODE_ENV === 'development' && {
            details: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack,
          }),
        });
    }
  }

  // Xử lý lỗi validation libraries (như joi, zod, etc)
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      type: ErrorType.VALIDATION,
      message: 'Validation failed',
      details: error.details || error.errors || error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Default: xử lý các lỗi không xác định
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    type: ErrorType.SERVER_ERROR,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
