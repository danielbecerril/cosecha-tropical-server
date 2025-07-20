/*
  # Create database schema for the API

  1. New Tables
    - `clients` - Customer information
      - `id` (serial, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text)
      - `address` (text)
    - `products` - Product catalog
      - `id` (serial, primary key)
      - `name` (text, not null)
      - `image` (text)
      - `stock` (integer, not null)
      - `price` (numeric, not null)
      - `cost` (numeric, not null)
    - `sales` - Sales records
      - `id` (serial, primary key)
      - `client_id` (integer, foreign key to clients)
      - `delivery_method` (text, not null)
      - `payment_status` (text, not null)
      - `total` (numeric, not null)
      - `date` (timestamp, not null)
    - `sale_products` - Junction table for sales and products
      - `sale_id` (integer, foreign key to sales)
      - `product_id` (integer, foreign key to products)
      - `quantity` (integer, not null)
      - `price` (numeric, not null)
      - Composite primary key on (sale_id, product_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    delivery_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sale_products table
CREATE TABLE IF NOT EXISTS sale_products (
    sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (sale_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_products ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON clients
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON products
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON sales
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON sale_products
    FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sale_products_sale_id ON sale_products(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_products_product_id ON sale_products(product_id);