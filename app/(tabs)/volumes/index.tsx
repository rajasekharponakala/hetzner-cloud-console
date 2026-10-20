import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useActiveApi } from '@/hooks/useActiveApi';
import { useList } from '@/hooks/useList';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { Button } from '@/components/Button';
import { confirm } from '@/components/ConfirmDialog';

export default function VolumesScreen() {
  const { api } = useActiveApi();
  const fetcher = React.useCallback(async () => {
    if (!api) return [];
    const res = await api.volumes.list(1, 50);
    return res.volumes;
  }, [api]);
  const { data, loading, error, refresh } = useList(fetcher, [api]);

  if (loading && data.length === 0) return <Loading label="Loading volumes…" />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(v) => String(v.id)}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <Card title={item.name}>
            <Text style={styles.meta}>
              {item.size} GB · {item.status} · {item.location.city}
            </Text>
            <Text style={styles.meta}>Server: {item.server ?? 'unattached'}</Text>
            <Button
              title="Delete"
              variant="danger"
              onPress={() =>
                confirm(
                  'Delete volume',
                  `Delete ${item.name}?`,
                  async () => {
                    await api!.volumes.delete(item.id);
                    refresh();
                  },
                  true,
                )
              }
            />
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No volumes</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  meta: { color: '#555', fontSize: 13, marginBottom: 2 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});
