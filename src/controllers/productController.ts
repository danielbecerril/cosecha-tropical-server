import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const products = await this.productService.getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const product = await this.productService.getProductById(id);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  });

  createProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const product = await this.productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const product = await this.productService.updateProduct(id, req.body);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    await this.productService.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  });
}