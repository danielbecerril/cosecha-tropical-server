import { supabase } from '../config/database';
import { Discount, CreateDiscountRequest, UpdateDiscountRequest } from '../types/database';
import { AppError } from '../middleware/errorHandler';
import type { SupabaseClient } from '@supabase/supabase-js';

export class DiscountService {
  private db: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.db = supabaseClient || supabase;
  }

  async getAllDiscounts(): Promise<Discount[]> {
    const { data, error } = await this.db
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch discounts: ${error.message}`, 500);
    }

    return data || [];
  }

  async getDiscountById(id: number): Promise<Discount> {
    const { data, error } = await this.db
      .from('discounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Discount not found', 404);
    }

    return data;
  }

  async createDiscount(discountData: CreateDiscountRequest, userId?: string): Promise<Discount> {
    const payload = { ...discountData, user_id: userId };
    const { data, error } = await this.db
      .from('discounts')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create discount: ${error.message}`, 400);
    }

    return data;
  }

  async updateDiscount(id: number, discountData: UpdateDiscountRequest): Promise<Discount> {
    const { data, error } = await this.db
      .from('discounts')
      .update({ ...discountData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Discount not found or failed to update', 404);
    }

    return data;
  }

  async deleteDiscount(id: number): Promise<void> {
    const { error } = await this.db
      .from('discounts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete discount: ${error.message}`, 400);
    }
  }
}
