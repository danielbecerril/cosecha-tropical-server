-- Add sale_type to sales to support free-sample ("Muestra") sales
ALTER TABLE sales ADD COLUMN IF NOT EXISTS sale_type TEXT NOT NULL DEFAULT 'Venta';

ALTER TABLE sales ADD CONSTRAINT sales_sale_type_check
  CHECK (sale_type IN ('Venta', 'Muestra'));
