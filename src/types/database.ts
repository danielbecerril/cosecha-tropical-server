export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  type?: string;
}

export interface Product {
  id: number;
  name: string;
  image?: string;
  stock: number;
  price: number;
  cost: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  image?: string;
  stock: number;
  price: number;
  cost: number;
}

export interface UpdateProductRequest {
  name?: string;
  image?: string;
  stock?: number;
  price?: number;
  cost?: number;
}

export interface Sale {
  id: number;
  client_id: number;
  delivery_method: string;
  payment_status: string;
  total: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSaleRequest {
  client_id: number;
  delivery_method: string;
  payment_status: string;
  total: number;
  date?: string;
  products: SaleProductRequest[];
}

export interface UpdateSaleRequest {
  client_id?: number;
  delivery_method?: string;
  payment_status?: string;
  total?: number;
  date?: string;
}

export interface SaleProduct {
  sale_id: number;
  product_id: number;
  quantity: number;
  quantity_paid?: number;
  price: number;
  cost: number;
}

export interface SaleProductRequest {
  product_id: number;
  quantity: number;
  quantity_paid?: number;
  price: number;
  cost: number;
}

export interface UpdateProductPaymentRequest {
  quantity_paid: number;
}

export interface SaleWithProducts extends Sale {
  client?: Client;
  products?: (SaleProduct & { product?: Product })[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}