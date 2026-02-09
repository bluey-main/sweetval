-- Migration to add proposal_type to valentines table
-- Default to 'asking' for backward compatibility

ALTER TABLE public.valentines 
ADD COLUMN proposal_type text NOT NULL DEFAULT 'asking' 
CHECK (proposal_type IN ('asking', 'wishing'));

-- Update existing records if any (optional as default handles it)
-- UPDATE public.valentines SET proposal_type = 'asking' WHERE proposal_type IS NULL;
