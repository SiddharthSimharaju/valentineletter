-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on gmail_tokens" ON public.gmail_tokens;

-- Create restrictive policy - deny all client access
-- Edge Functions use service role key which bypasses RLS, so they can still access
CREATE POLICY "Deny client access to gmail_tokens"
ON public.gmail_tokens
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);