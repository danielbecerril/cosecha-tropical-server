-- Add quantity_paid column to sale_products table
ALTER TABLE sale_products 
ADD COLUMN quantity_paid INTEGER DEFAULT 0;

-- Add constraint to ensure quantity_paid is between 0 and quantity
ALTER TABLE sale_products 
ADD CONSTRAINT check_quantity_paid 
CHECK (quantity_paid >= 0 AND quantity_paid <= quantity);

-- Update existing records to have quantity_paid = 0
UPDATE sale_products 
SET quantity_paid = 0 
WHERE quantity_paid IS NULL; 