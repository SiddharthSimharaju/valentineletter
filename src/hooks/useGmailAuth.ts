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

  // Handle gmail_connected callback param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gmailConnected = urlParams.get('gmail_connected');
    const gmailError = urlParams.get('gmail_error');
    
    if (gmailConnected) {
      setConnection({
        isConnected: true,
        email: gmailConnected,
        isLoading: false,
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (gmailError) {
      console.error('Gmail auth error:', gmailError);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Start OAuth flow
  const connectGmail = async () => {
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}`;
      
      const { data, error } = await supabase.functions.invoke('gmail-auth-url', {
        body: { returnUrl }
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
