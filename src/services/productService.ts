import { supabase, createSupabaseClientWithAuth } from '../config/database';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/database';
import { AppError } from '../middleware/errorHandler';
import type { SupabaseClient } from '@supabase/supabase-js';

export class ProductService {
  private db: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.db = supabaseClient || supabase;
  }

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }

    return data || [];
  }

  async getProductById(id: number): Promise<Product> {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Product not found', 404);
    }

    return data;
  }

  async createProduct(productData: CreateProductRequest, userId?: string): Promise<Product> {
    const payload = {
      ...productData,
      user_id: userId
    };
    const { data, error } = await this.db
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create product: ${error.message}`, 400);
    }

    return data;
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product> {
    const { data, error } = await this.db
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Product not found or failed to update', 404);
    }

    return data;
  }

  async deleteProduct(id: number): Promise<void> {
    const { error } = await this.db
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete product: ${error.message}`, 400);
    }
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    const newStock = product.stock - quantity;

    if (newStock < 0) {
      throw new AppError('Insufficient stock', 400);
    }

    return this.updateProduct(id, { stock: newStock });
  }

  async increaseStock(id: number, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    const newStock = product.stock + quantity;
    return this.updateProduct(id, { stock: newStock });
  }
}