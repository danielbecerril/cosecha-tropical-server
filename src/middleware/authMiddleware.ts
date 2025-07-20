import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/database';
import { AppError } from './errorHandler';

// Password constant - in production, this should be stored in environment variables
const API_PASSWORD = 'cosecha-tropical-2025';

export interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const password = req.headers['x-api-password'] || req.headers['authorization'];

    if (!password) {
      throw new AppError('Authentication required. Missing password header.', 401);
    }

    // Remove 'Bearer ' prefix if present
    const cleanPassword = typeof password === 'string' 
      ? password.replace(/^Bearer\s+/, '') 
      : password;

    if (cleanPassword !== API_PASSWORD) {
      throw new AppError('Invalid password. Access denied.', 401);
    }

    // Mark request as authenticated
    req.isAuthenticated = true;
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

// Optional: Middleware to check if request is authenticated (for conditional logic)
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  if (!req.isAuthenticated) {
    return next(new AppError('Authentication required', 401));
  }
  next();
}; 