import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/database';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Log the complete error details including stack trace for debugging
  // But never include stack traces in API responses for security
  console.error('Error Details:', {
    message: err.message,
    statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(err instanceof AppError && { isOperational: err.isOperational })
  });

  // Always return clean error response without stack traces
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};