import { Request, Response } from 'express';
import { SaleService } from '../services/saleService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { SaleWithProducts } from '../types/database';
import { createSupabaseClientWithAuth } from '../config/database';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  getAllSales = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const sales: SaleWithProducts[] = await service.getAllSales();
    res.status(200).json({
      success: true,
      data: sales,
      message: 'Sales retrieved successfully'
    });
  });

  getSaleById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const sale = await service.getSaleById(id);
    res.status(200).json({
      success: true,
      data: sale,
      message: 'Sale retrieved successfully'
    });
  });

  createSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken, user } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const sale = await service.createSale(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: sale,
      message: 'Sale created successfully'
    });
  });

  updateSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const sale = await service.updateSale(id, req.body);
    res.status(200).json({
      success: true,
      data: sale,
      message: 'Sale updated successfully'
    });
  });

  deleteSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    await service.deleteSale(id);
    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully'
    });
  });

  updateProductPayment = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const saleId = parseInt(req.params.saleId);
    const productId = parseInt(req.params.productId);
    const paymentData = req.body;

    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const updatedProduct = await service.updateProductPayment(saleId, productId, paymentData);
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product payment updated successfully'
    });
  });

  removeProductFromSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const saleId = parseInt(req.params.saleId);
    const productId = parseInt(req.params.productId);
    const quantity = parseInt(req.params.quantity);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new SaleService(createSupabaseClientWithAuth(authToken)) : this.saleService;
    const removedProduct = await service.removeProductFromSale(saleId, productId, quantity);
    res.status(200).json({
      success: true,
      data: removedProduct,
      message: 'Product removed from sale successfully'
    });
  });
}