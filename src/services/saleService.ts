import { supabase } from '../config/database';
import { Sale, CreateSaleRequest, UpdateSaleRequest, SaleWithProducts, UpdateProductPaymentRequest } from '../types/database';
import { AppError } from '../middleware/errorHandler';
import { ProductService } from './productService';

export class SaleService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllSales(): Promise<SaleWithProducts[]> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone,
          address
        ),
        sale_products (
          sale_id,
          product_id,
          quantity,
          quantity_paid,
          price,
          cost,
          products:product_id (
            id,
            name,
            image,
            stock,
            price,
            cost
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch sales: ${error.message}`, 500);
    }

    return data?.map(sale => ({
      id: sale.id,
      client_id: sale.client_id,
      delivery_method: sale.delivery_method,
      payment_status: sale.payment_status,
      total: sale.total,
      date: sale.date,
      created_at: sale.created_at,
      client: sale.clients,
      sale_products: sale.sale_products?.map((sp: any) => ({
        sale_id: sp.sale_id,
        product_id: sp.product_id,
        quantity: sp.quantity,
        quantity_paid: sp.quantity_paid || 0,
        price: sp.price,
        cost: sp.cost,
        product: {
          id: sp.products.id,
          name: sp.products.name,
          price: sp.products.price
        }
      }))
    })) || [];
  }

  async getSaleById(id: number): Promise<SaleWithProducts> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone,
          address
        ),
        sale_products (
          sale_id,
          product_id,
          quantity,
          quantity_paid,
          price,
          cost,
          products:product_id (
            id,
            name,
            image,
            stock,
            price,
            cost
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Sale not found', 404);
    }

    return {
      ...data,
      client: data.clients,
      products: data.sale_products?.map((sp: any) => ({
        ...sp,
        quantity_paid: sp.quantity_paid || 0,
        product: sp.products
      }))
    };
  }

  async createSale(saleData: CreateSaleRequest): Promise<SaleWithProducts> {
    const { products, ...saleInfo } = saleData;

    // Start transaction by creating the sale first
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        ...saleInfo,
        date: saleData.date || new Date().toISOString()
      }])
      .select()
      .single();

    if (saleError || !sale) {
      throw new AppError(`Failed to create sale: ${saleError?.message}`, 400);
    }

    // Create sale products
    const saleProducts = products.map(product => ({
      sale_id: sale.id,
      product_id: product.product_id,
      quantity: product.quantity,
      price: product.price,
      cost: product.cost
    }));

    const { error: productsError } = await supabase
      .from('sale_products')
      .insert(saleProducts);

    if (productsError) {
      // Rollback by deleting the sale
      await supabase.from('sales').delete().eq('id', sale.id);
      throw new AppError(`Failed to create sale products: ${productsError.message}`, 400);
    }

    // Update product stock
    for (const product of products) {
      try {
        await this.productService.updateStock(product.product_id, product.quantity);
      } catch (error) {
        // Rollback by deleting the sale
        await supabase.from('sales').delete().eq('id', sale.id);
        throw error;
      }
    }

    return this.getSaleById(sale.id);
  }

  async updateSale(id: number, saleData: UpdateSaleRequest): Promise<SaleWithProducts> {
    const { data, error } = await supabase
      .from('sales')
      .update({ ...saleData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Sale not found or failed to update', 404);
    }

    return this.getSaleById(id);
  }

  async deleteSale(id: number): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete sale: ${error.message}`, 400);
    }
  }

  async updateProductPayment(saleId: number, productId: number, paymentData: UpdateProductPaymentRequest): Promise<any> {
    // First, get the current sale product to validate the quantity
    const { data: currentProduct, error: fetchError } = await supabase
      .from('sale_products')
      .select('quantity, quantity_paid')
      .eq('sale_id', saleId)
      .eq('product_id', productId)
      .single();

    if (fetchError || !currentProduct) {
      throw new AppError('Sale product not found', 404);
    }

    const { quantity_paid } = paymentData;
    const currentQuantity = currentProduct.quantity;
    const currentQuantityPaid = currentProduct.quantity_paid || 0;

    // Validate that quantity_paid is between 0 and the product's quantity
    if (quantity_paid < 0 || quantity_paid > currentQuantity) {
      throw new AppError(`quantity_paid must be between 0 and ${currentQuantity}`, 400);
    }

    // Update the quantity_paid field
    const { data, error } = await supabase
      .from('sale_products')
      .update({ quantity_paid })
      .eq('sale_id', saleId)
      .eq('product_id', productId)
      .select(`
        sale_id,
        product_id,
        quantity,
        quantity_paid,
        price,
        cost,
        products:product_id (
          id,
          name,
          image,
          stock,
          price,
          cost
        )
      `)
      .single();

    if (error) {
      throw new AppError(`Failed to update product payment: ${error.message}`, 400);
    }

    return {
      sale_id: data.sale_id,
      product_id: data.product_id,
      quantity: data.quantity,
      quantity_paid: data.quantity_paid,
      price: data.price,
      cost: data.cost,
      product: data.products
    };
  }
}