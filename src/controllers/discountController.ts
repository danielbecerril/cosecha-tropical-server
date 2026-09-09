import { Request, Response } from 'express';
import { DiscountService } from '../services/discountService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createSupabaseClientWithAuth } from '../config/database';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountService();
  }

  getAllDiscounts = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new DiscountService(createSupabaseClientWithAuth(authToken)) : this.discountService;
    const discounts = await service.getAllDiscounts();
    res.status(200).json({
      success: true,
      data: discounts,
      message: 'Discounts retrieved successfully'
    });
  });

  getDiscountById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new DiscountService(createSupabaseClientWithAuth(authToken)) : this.discountService;
    const discount = await service.getDiscountById(id);
    res.status(200).json({
      success: true,
      data: discount,
      message: 'Discount retrieved successfully'
    });
  });

  createDiscount = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken, user } = req as AuthenticatedRequest;
    const service = authToken ? new DiscountService(createSupabaseClientWithAuth(authToken)) : this.discountService;
    const discount = await service.createDiscount(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: discount,
      message: 'Discount created successfully'
    });
  });

  updateDiscount = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new DiscountService(createSupabaseClientWithAuth(authToken)) : this.discountService;
    const discount = await service.updateDiscount(id, req.body);
    res.status(200).json({
      success: true,
      data: discount,
      message: 'Discount updated successfully'
    });
  });

  deleteDiscount = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new DiscountService(createSupabaseClientWithAuth(authToken)) : this.discountService;
    await service.deleteDiscount(id);
    res.status(200).json({
      success: true,
      message: 'Discount deleted successfully'
    });
  });
}
