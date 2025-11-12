import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createSupabaseClientWithAuth } from '../config/database';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ProductService(createSupabaseClientWithAuth(authToken)) : this.productService;
    const products = await service.getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ProductService(createSupabaseClientWithAuth(authToken)) : this.productService;
    const product = await service.getProductById(id);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  });

  createProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken, user } = req as AuthenticatedRequest;
    const service = authToken ? new ProductService(createSupabaseClientWithAuth(authToken)) : this.productService;
    const product = await service.createProduct(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ProductService(createSupabaseClientWithAuth(authToken)) : this.productService;
    const product = await service.updateProduct(id, req.body);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ProductService(createSupabaseClientWithAuth(authToken)) : this.productService;
    await service.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  });
}