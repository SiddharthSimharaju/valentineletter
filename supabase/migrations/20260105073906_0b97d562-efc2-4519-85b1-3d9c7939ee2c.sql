-- Block anonymous access to gmail_tokens table
-- The existing RESTRICTIVE policy blocks authenticated users, but we need to also block anon role

CREATE POLICY "Block anonymous access to gmail_tokens"
ON public.gmail_tokens
FOR ALL
TO anon
USING (false)
WITH CHECK (false);