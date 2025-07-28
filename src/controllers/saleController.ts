import { Request, Response } from 'express';
import { SaleService } from '../services/saleService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { SaleWithProducts } from '../types/database';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  getAllSales = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const sales: SaleWithProducts[] = await this.saleService.getAllSales();
    res.status(200).json({
      success: true,
      data: sales,
      message: 'Sales retrieved successfully'
    });
  });

  getSaleById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const sale = await this.saleService.getSaleById(id);
    res.status(200).json({
      success: true,
      data: sale,
      message: 'Sale retrieved successfully'
    });
  });

  createSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const sale = await this.saleService.createSale(req.body);
    res.status(201).json({
      success: true,
      data: sale,
      message: 'Sale created successfully'
    });
  });

  updateSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const sale = await this.saleService.updateSale(id, req.body);
    res.status(200).json({
      success: true,
      data: sale,
      message: 'Sale updated successfully'
    });
  });

  deleteSale = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    await this.saleService.deleteSale(id);
    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully'
    });
  });

  updateProductPayment = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const saleId = parseInt(req.params.saleId);
    const productId = parseInt(req.params.productId);
    const paymentData = req.body;

    const updatedProduct = await this.saleService.updateProductPayment(saleId, productId, paymentData);
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product payment updated successfully'
    });
  });
}