import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useActiveApi } from '@/hooks/useActiveApi';
import { useList } from '@/hooks/useList';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { Button } from '@/components/Button';

export default function ServersScreen() {
  const { api, loading: apiLoading } = useActiveApi();
  const router = useRouter();
  const fetcher = React.useCallback(async () => {
    if (!api) return [];
    const res = await api.servers.list(1, 50);
    return res.servers;
  }, [api]);
  const { data, loading, error, refresh } = useList(fetcher, [api]);

  if (apiLoading || (loading && data.length === 0)) return <Loading label="Loading servers…" />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;
  if (!api) return <ErrorView message="No active account" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(s) => String(s.id)}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <Card title={item.name}>
            <View style={styles.row}>
              <Badge label={item.status} />
              <Text style={styles.meta}>
                {item.server_type.name} · {item.datacenter.location.city}
              </Text>
            </View>
            <Text style={styles.ip}>{item.public_net.ipv4?.ip ?? 'no ipv4'}</Text>
            <Button
              title="Open"
              variant="ghost"
              onPress={() => router.push(`/(tabs)/servers/${item.id}`)}
            />
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No servers</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  meta: { color: '#555', fontSize: 13 },
  ip: { color: '#333', marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});
