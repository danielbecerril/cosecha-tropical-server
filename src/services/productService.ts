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

  // Snaps case/whitespace variants of a brand onto the spelling already on
  // file (e.g. "MANGO LOCO" -> "Mango Loco"), so the same brand never
  // fragments into multiple entries by typo of case alone.
  private async canonicalizeBrand(brand: string | null | undefined): Promise<string | null | undefined> {
    if (brand === undefined) return undefined;
    const trimmed = brand?.trim();
    if (!trimmed) return null;

    const { data } = await this.db
      .from('products')
      .select('brand')
      .ilike('brand', trimmed.replace(/[%_]/g, '\\$&'))
      .limit(1);

    return data?.[0]?.brand ?? trimmed;
  }

  async createProduct(productData: CreateProductRequest, userId?: string): Promise<Product> {
    const payload = {
      ...productData,
      brand: await this.canonicalizeBrand(productData.brand),
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
    const payload = {
      ...productData,
      ...('brand' in productData ? { brand: await this.canonicalizeBrand(productData.brand) } : {}),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await this.db
      .from('products')
      .update(payload)
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