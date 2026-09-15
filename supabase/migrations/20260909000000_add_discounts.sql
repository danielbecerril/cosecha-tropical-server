-- Discount catalog: reusable discounts that can be created ahead of time and
-- selected at the moment of sale.
CREATE TABLE IF NOT EXISTS discounts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'quantity')),
    value NUMERIC(10,2) NOT NULL CHECK (value > 0),
    active BOOLEAN NOT NULL DEFAULT true,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users" ON discounts
    FOR ALL TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(active);

-- Snapshot of whichever discount (if any) was applied to a sale. Stored as
-- JSONB rather than a foreign key so a sale's ticket keeps showing exactly
-- what was applied even if the catalog discount it came from is later
-- edited or deleted. Expected shape:
--   { "id": 3, "name": "Cliente frecuente", "type": "percentage",
--     "value": 10, "amount_off": 25.50 }
ALTER TABLE sales ADD COLUMN IF NOT EXISTS discount JSONB;
