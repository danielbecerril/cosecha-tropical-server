-- Optional brand for each product; NULL = "Sin marca"
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;
