

# Fix Gmail OAuth Redirect URI Mismatch

## Problem
Currently, the app sends the user's current page URL (e.g., `https://lettersonvalentines.com/create`) as the `redirect_uri` to Google. This means every possible origin+path combination must be registered in Google Console -- fragile and error-prone.

## Solution
Create a dedicated backend callback endpoint that serves as the **single, fixed** OAuth redirect URI. Google will always redirect to this endpoint, which will exchange the code for tokens and then redirect the user back to the app.

This means you only need **one** redirect URI in Google Console:
```
https://lrzyznsxeidnzcthknwc.supabase.co/functions/v1/gmail-callback
```

## Flow

```text
User clicks "Sign in with Google"
        |
        v
Frontend calls gmail-auth-url edge function
  (sends returnUrl = current page URL)
        |
        v
Edge function builds Google auth URL with:
  redirect_uri = https://<project>.supabase.co/functions/v1/gmail-callback
  state = returnUrl (encoded)
        |
        v
Google shows consent screen --> redirects to gmail-callback
        |
        v
gmail-callback edge function:
  1. Extracts code + state (returnUrl) from query params
  2. Exchanges code for tokens (using the fixed redirect_uri)
  3. Stores tokens in gmail_tokens table
  4. Redirects user to returnUrl?gmail_connected=email@example.com
        |
        v
Frontend picks up gmail_connected param, updates state, cleans URL
```

## Technical Details

### 1. New edge function: `gmail-callback`
- Handles GET requests (Google redirects with query params, not POST)
- Uses the fixed redirect URI for token exchange
- Stores tokens server-side (same logic currently in `gmail-exchange-token`)
- Redirects the user back to the app with a success parameter

### 2. Update `gmail-auth-url` edge function
- Change `redirect_uri` to the fixed callback URL
- Accept `returnUrl` instead of `redirectUri` from the frontend
- Encode `returnUrl` in the Google OAuth `state` parameter

### 3. Update `useGmailAuth.ts` hook
- `connectGmail`: send `returnUrl` (current page) instead of `redirectUri`
- Remove the `code` query param handler (no longer needed)
- Add handler for `gmail_connected` query param instead

### 4. Google Console configuration
- Remove all existing redirect URIs
- Add only: `https://lrzyznsxeidnzcthknwc.supabase.co/functions/v1/gmail-callback`

### 5. Config update
- Add `[functions.gmail-callback]` with `verify_jwt = false` to `supabase/config.toml`

