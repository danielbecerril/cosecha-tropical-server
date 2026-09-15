export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type?: string;
  user_id?: string;
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
  brand?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  image?: string;
  stock: number;
  price: number;
  cost: number;
  brand?: string | null;
  user_id?: string;
}

export interface UpdateProductRequest {
  name?: string;
  image?: string;
  stock?: number;
  price?: number;
  cost?: number;
  brand?: string | null;
}

export type DiscountType = 'percentage' | 'quantity';

export interface Discount {
  id: number;
  name: string;
  type: DiscountType;
  value: number;
  active: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  value: number;
  active?: boolean;
  user_id?: string;
}

export interface UpdateDiscountRequest {
  name?: string;
  type?: DiscountType;
  value?: number;
  active?: boolean;
}

// Snapshot of a discount as applied to a specific sale, stored in
// sales.discount (JSONB). amount_off is the actual currency amount
// deducted, precomputed at sale time so the ticket doesn't need to
// re-derive it from the (possibly since-changed) catalog discount.
export interface AppliedDiscount {
  id?: number;
  name: string;
  type: DiscountType;
  value: number;
  amount_off: number;
}

export type DeliveryMethod = 'En Persona' | 'Paquetería';

export type SaleType = 'Venta' | 'Muestra';

// 'Devuelto' is set automatically once every product on a sale has been
// returned (see SaleService.removeProductFromSale); it isn't user-selectable
// at sale creation the way 'Pagado'/'Por pagar' are.
export type PaymentStatus = 'Pagado' | 'Por pagar' | 'Devuelto';

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta';

export interface Sale {
  id: number;
  client_id: number;
  delivery_method: DeliveryMethod;
  delivery_cost?: number;
  payment_status: string;
  payment_method?: PaymentMethod;
  sale_type: SaleType;
  discount?: AppliedDiscount | null;
  total: number;
  date: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSaleRequest {
  client_id: number;
  delivery_method: DeliveryMethod;
  delivery_cost?: number;
  payment_status: string;
  payment_method?: PaymentMethod;
  sale_type?: SaleType;
  discount?: AppliedDiscount | null;
  total: number;
  date?: string;
  user_id?: string;
  products: SaleProductRequest[];
}

export interface UpdateSaleRequest {
  client_id?: number;
  delivery_method?: DeliveryMethod;
  delivery_cost?: number;
  payment_status?: string;
  payment_method?: PaymentMethod;
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
  user_id?: string;
}

export interface SaleProductRequest {
  product_id: number;
  quantity: number;
  quantity_paid?: number;
  price: number;
  cost: number;
  user_id?: string;
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