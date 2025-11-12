import { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { ApiResponse } from '../types/database';
import { AppError } from './errorHandler';
import { supabase } from '../config/database';

export interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
  user?: User;
  authToken?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new AppError('Authentication required. Missing Authorization header.', 401);
    }

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      throw new AppError('Invalid Authorization header format. Expected Bearer token.', 401);
    }

    const token = match[1];

    // Validate token with Supabase and retrieve the user
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new AppError('Invalid or expired token. Access denied.', 401);
    }

    // Attach auth context to request
    req.isAuthenticated = true;
    req.user = data.user;
    req.authToken = token;

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