-- Add payment_method to sales to record how the customer paid
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_method TEXT;

ALTER TABLE sales ADD CONSTRAINT sales_payment_method_check
  CHECK (payment_method IN ('Efectivo', 'Transferencia', 'Tarjeta'));
