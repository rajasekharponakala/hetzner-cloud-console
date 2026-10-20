import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useActiveApi } from '@/hooks/useActiveApi';
import { useList } from '@/hooks/useList';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';

export default function PlacementGroupsScreen() {
  const { api } = useActiveApi();
  const fetcher = React.useCallback(async () => {
    if (!api) return [];
    const res = await api.placementGroups.list();
    return res.placement_groups;
  }, [api]);
  const { data, loading, error, refresh } = useList(fetcher, [api]);
  if (loading && data.length === 0) return <Loading label="Loading placement groups…" />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(g) => String(g.id)}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <Card title={item.name}>
            <Text style={styles.meta}>
              {item.type} · servers: {item.servers.length}
            </Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No placement groups</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  meta: { color: '#555', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});
