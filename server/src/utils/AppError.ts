export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export class AppError extends Error {
  statusCode: number;
  type: ErrorType;
  isOperational: boolean;
  errors?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    type: ErrorType = ErrorType.SERVER_ERROR,
    isOperational: boolean = true,
    errors?: Record<string, any>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    this.errors = errors;

    // Bảo đảm stack trace ghi nhận đúng vị trí lỗi
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: Record<string, any>): AppError {
    return new AppError(message, 400, ErrorType.VALIDATION, true, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 401, ErrorType.AUTHENTICATION);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 403, ErrorType.AUTHORIZATION);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404, ErrorType.NOT_FOUND);
  }

  static conflict(message: string, errors?: Record<string, any>): AppError {
    return new AppError(message, 409, ErrorType.CONFLICT, true, errors);
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500, ErrorType.SERVER_ERROR);
  }

  static database(message: string, errors?: Record<string, any>): AppError {
    return new AppError(message, 500, ErrorType.DATABASE_ERROR, true, errors);
  }
}
