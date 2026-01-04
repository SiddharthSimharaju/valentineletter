-- Create table to store Gmail OAuth tokens
CREATE TABLE public.gmail_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (but allow public access since this is a single-user app)
ALTER TABLE public.gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write tokens (single-user app without auth)
CREATE POLICY "Allow all operations on gmail_tokens"
ON public.gmail_tokens
FOR ALL
USING (true)
WITH CHECK (true);