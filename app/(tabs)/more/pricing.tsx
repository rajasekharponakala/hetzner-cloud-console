import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useActiveApi } from '@/hooks/useActiveApi';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { Card } from '@/components/Card';

export default function PricingScreen() {
  const { api } = useActiveApi();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!api) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.pricing.get();
      setData(res.pricing);
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    } finally {
      setLoading(false);
    }
  }, [api]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Loading pricing…" />;
  if (error || !data) return <ErrorView message={error ?? 'No data'} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <Card title="Pricing">
        <Text style={styles.meta}>Currency: {data.currency}</Text>
        <Text style={styles.meta}>VAT rate: {data.vat_rate}</Text>
        <Text style={styles.meta}>Server types: {data.server_types?.length ?? 0}</Text>
        <Text style={styles.meta}>
          Load balancer types: {data.load_balancer_types?.length ?? 0}
        </Text>
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  meta: { color: '#333', marginBottom: 4 },
});
