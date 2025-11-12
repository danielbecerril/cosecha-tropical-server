import { supabase } from '../config/database';
import { Client, CreateClientRequest, UpdateClientRequest } from '../types/database';
import { AppError } from '../middleware/errorHandler';
import type { SupabaseClient } from '@supabase/supabase-js';

export class ClientService {
  private db: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.db = supabaseClient || supabase;
  }

  async getAllClients(): Promise<Client[]> {
    const { data, error } = await this.db
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch clients: ${error.message}`, 500);
    }

    return data || [];
  }

  async getClientById(id: number): Promise<Client> {
    const { data, error } = await this.db
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Client not found', 404);
    }

    return data;
  }

  async createClient(clientData: CreateClientRequest, userId?: string): Promise<Client> {
    const payload = { ...clientData, user_id: userId };
    const { data, error } = await this.db
      .from('clients')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create client: ${error.message}`, 400);
    }

    return data;
  }

  async updateClient(id: number, clientData: UpdateClientRequest): Promise<Client> {
    const { data, error } = await this.db
      .from('clients')
      .update({ ...clientData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Client not found or failed to update', 404);
    }

    return data;
  }

  async deleteClient(id: number): Promise<void> {
    const { error } = await this.db
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      // Check if it's a foreign key constraint violation (client referenced in sales)
      if (error.code === '23503' || error.message.includes('violates foreign key constraint') || error.message.includes('is still referenced')) {
        throw new AppError('Cannot delete client because they are linked to existing sales. Please remove all sales for this client first.', 409);
      }
      
      throw new AppError(`Failed to delete client: ${error.message}`, 400);
    }
  }
}