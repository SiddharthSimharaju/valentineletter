import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GmailConnection {
  isConnected: boolean;
  email: string | null;
  isLoading: boolean;
}

export function useGmailAuth() {
  const [connection, setConnection] = useState<GmailConnection>({
    isConnected: false,
    email: null,
    isLoading: true,
  });
  const tokenStoreAttempted = useRef(false);

  // Check if Gmail is already connected — first check local session, then edge function
  const checkConnection = useCallback(async () => {
    try {
      // Quick local check: if there's an active Supabase session with Google provider, use it
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.app_metadata?.provider === 'google' && session.user.email) {
        setConnection({
          isConnected: true,
          email: session.user.email,
          isLoading: false,
        });
        return;
      }

      // Fall back to edge function check (with timeout)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const { data, error } = await supabase.functions.invoke('gmail-check-connection', {
        body: {},
      });

      clearTimeout(timeout);

      if (error) {
        console.error('Error checking Gmail connection:', error);
        setConnection({ isConnected: false, email: null, isLoading: false });
        return;
      }

      setConnection({
        isConnected: data?.isConnected || false,
        email: data?.email || null,
        isLoading: false,
      });
    } catch {
      setConnection({ isConnected: false, email: null, isLoading: false });
    }
  }, []);

  // On mount, check URL params from gmail-callback redirect, then check connection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmailConnected = params.get('gmail_connected');
    const gmailError = params.get('gmail_error');

    if (gmailConnected) {
      setConnection({ isConnected: true, email: gmailConnected, isLoading: false });
      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete('gmail_connected');
      window.history.replaceState({}, '', url.toString());
      return;
    }

    if (gmailError) {
      console.error('Gmail OAuth error:', gmailError);
      const url = new URL(window.location.href);
      url.searchParams.delete('gmail_error');
      window.history.replaceState({}, '', url.toString());
    }

    checkConnection();
    const safetyTimeout = setTimeout(() => {
      setConnection(prev => prev.isLoading ? { ...prev, isLoading: false } : prev);
    }, 10000);
    return () => clearTimeout(safetyTimeout);
  }, [checkConnection]);

  // Listen for Supabase auth state changes to capture provider tokens after OAuth redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
        session?.provider_token &&
        !tokenStoreAttempted.current
      ) {
        tokenStoreAttempted.current = true;
        try {
          const { error } = await supabase.functions.invoke('gmail-store-token', {
            body: {
              access_token: session.provider_token,
              refresh_token: session.provider_refresh_token || null,
              email: session.user?.email,
            },
          });

          if (!error) {
            setConnection({
              isConnected: true,
              email: session.user?.email || null,
              isLoading: false,
            });
          } else {
            console.error('Failed to store Gmail tokens:', error);
            await checkConnection();
          }
        } catch (err) {
          console.error('Failed to store Gmail tokens:', err);
          // Even if storing fails, check if session itself indicates connection
          if (session?.user?.email) {
            setConnection({
              isConnected: true,
              email: session.user.email,
              isLoading: false,
            });
          }
        }
      } else if (event === 'SIGNED_IN' && session?.user?.email) {
        // Signed in but no provider_token (e.g. returning user with existing session)
        setConnection({
          isConnected: true,
          email: session.user.email,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [checkConnection]);

  // Start OAuth flow using custom edge function to get gmail.send scope
  const connectGmail = async () => {
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}`;
      const { data, error } = await supabase.functions.invoke('gmail-auth-url', {
        body: { returnUrl },
      });

      if (error) throw error;
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL returned');
      }
    } catch (err) {
      console.error('Failed to start Gmail auth:', err);
      throw err;
    }
  };

  // Disconnect Gmail
  const disconnectGmail = async () => {
    try {
      if (connection.email) {
        await supabase.functions.invoke('gmail-disconnect', {
          body: { email: connection.email },
        });
      }
      await supabase.auth.signOut();
      tokenStoreAttempted.current = false;
      setConnection({ isConnected: false, email: null, isLoading: false });
    } catch (err) {
      console.error('Failed to disconnect Gmail:', err);
    }
  };

  return {
    ...connection,
    connectGmail,
    disconnectGmail,
    refresh: checkConnection,
  };
}
