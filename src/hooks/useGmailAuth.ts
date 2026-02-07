import { useState, useEffect, useCallback } from 'react';
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

  // Check if Gmail is already connected via edge function (no direct table access)
  const checkConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gmail-check-connection');

      if (error) {
        console.error('Error checking Gmail connection:', error);
        setConnection({
          isConnected: false,
          email: null,
          isLoading: false,
        });
        return;
      }

      setConnection({
        isConnected: data?.isConnected || false,
        email: data?.email || null,
        isLoading: false,
      });
    } catch {
      setConnection({
        isConnected: false,
        email: null,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && !connection.isConnected) {
        try {
          const redirectUri = `${window.location.origin}${window.location.pathname}`;
          
          const { data, error } = await supabase.functions.invoke('gmail-exchange-token', {
            body: { code, redirectUri }
          });

          if (error) throw error;

          if (data?.email) {
            setConnection({
              isConnected: true,
              email: data.email,
              isLoading: false,
            });
            
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (err) {
          console.error('Gmail auth callback error:', err);
          // Clean up URL even on error
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    };

    handleCallback();
  }, [connection.isConnected]);

  // Start OAuth flow
  const connectGmail = async () => {
    try {
      const redirectUri = `${window.location.origin}${window.location.pathname}`;
      
      const { data, error } = await supabase.functions.invoke('gmail-auth-url', {
        body: { redirectUri }
      });

      if (error) throw error;

      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to start Gmail auth:', err);
      throw err;
    }
  };

  // Disconnect Gmail via edge function (no direct table access)
  const disconnectGmail = async () => {
    try {
      if (connection.email) {
        const { error } = await supabase.functions.invoke('gmail-disconnect', {
          body: { email: connection.email }
        });

        if (error) {
          console.error('Error disconnecting Gmail:', error);
          return;
        }
      }
      
      setConnection({
        isConnected: false,
        email: null,
        isLoading: false,
      });
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
