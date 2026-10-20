import { useState, useEffect, useCallback } from 'react';
import { getActiveAccount } from '@/auth/accounts';
import { createApi, type HetznerApi } from '@/api';

export function useActiveApi() {
  const [api, setApi] = useState<HetznerApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const acc = await getActiveAccount();
      if (!acc) {
        setApi(null);
      } else {
        setApi(createApi(acc.token));
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load account');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);
  return { api, loading, error, reload };
}
