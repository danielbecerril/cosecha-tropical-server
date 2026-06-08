import { Request, Response } from 'express';
import multer from 'multer';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createSupabaseClientWithAuth, supabase } from '../config/database';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export const upload = multer({ storage: multer.memoryStorage() });

const BUCKET_NAME = 'product-images';

async function uploadImageToStorage(
  file: Express.Multer.File,
  supabaseClient: ReturnType<typeof createSupabaseClientWithAuth>
): Promise<string> {
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(fileName);
  return data.publicUrl;
}

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
    const dbClient = authToken ? createSupabaseClientWithAuth(authToken) : supabase;
    const service = authToken ? new ProductService(dbClient) : this.productService;

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, dbClient as ReturnType<typeof createSupabaseClientWithAuth>);
    }

    const product = await service.createProduct({ ...req.body, image: imageUrl }, user?.id);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const dbClient = authToken ? createSupabaseClientWithAuth(authToken) : supabase;
    const service = authToken ? new ProductService(dbClient) : this.productService;

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, dbClient as ReturnType<typeof createSupabaseClientWithAuth>);
    }

    const product = await service.updateProduct(id, { ...req.body, ...(imageUrl && { image: imageUrl }) });
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