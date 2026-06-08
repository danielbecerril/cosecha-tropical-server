-- Add delivery_cost column to sales table
ALTER TABLE sales ADD COLUMN IF NOT EXISTS delivery_cost NUMERIC(10,2);

-- Add check constraint to enforce valid delivery_method values
ALTER TABLE sales ADD CONSTRAINT sales_delivery_method_check
  CHECK (delivery_method IN ('En Persona', 'Paquetería'));

-- Add check constraint: delivery_cost must be set (>= 0) when method is Paquetería,
-- and must be null when method is En Persona
ALTER TABLE sales ADD CONSTRAINT sales_delivery_cost_check
  CHECK (
    (delivery_method = 'Paquetería' AND delivery_cost IS NOT NULL AND delivery_cost >= 0)
    OR
    (delivery_method = 'En Persona' AND delivery_cost IS NULL)
  );
