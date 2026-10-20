import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActiveApi } from '@/hooks/useActiveApi';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { confirm } from '@/components/ConfirmDialog';
import type { Server } from '@/types/hetzner';

export default function ServerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { api } = useActiveApi();
  const router = useRouter();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.servers.get(Number(id));
      setServer(res.server);
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const act = async (name: string, body?: any) => {
    if (!api) return;
    setBusy(true);
    try {
      await api.servers.action(Number(id), name, body);
      await load();
    } catch (e: any) {
      alert(e?.message ?? 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !server) return <ErrorView message={error ?? 'Not found'} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <Card title={server.name}>
        <Badge label={server.status} />
        <Text style={styles.line}>Type: {server.server_type.name}</Text>
        <Text style={styles.line}>Location: {server.datacenter.location.city}</Text>
        <Text style={styles.line}>IPv4: {server.public_net.ipv4?.ip ?? '—'}</Text>
        <Text style={styles.line}>IPv6: {server.public_net.ipv6?.ip ?? '—'}</Text>
        <Text style={styles.line}>
          Cores: {server.server_type.cores} · RAM: {server.server_type.memory}GB · Disk:{' '}
          {server.server_type.disk}GB
        </Text>
      </Card>
      <View style={styles.actions}>
        <Button title="Power On" onPress={() => act('poweron')} disabled={busy} />
        <Button title="Power Off" onPress={() => act('poweroff')} disabled={busy} />
        <Button title="Reboot" onPress={() => act('reboot')} disabled={busy} />
        <Button title="Shutdown" onPress={() => act('shutdown')} disabled={busy} />
        <Button title="Reset" variant="ghost" onPress={() => act('reset')} disabled={busy} />
        <Button
          title="Delete"
          variant="danger"
          disabled={busy}
          onPress={() =>
            confirm(
              'Delete server',
              `Delete ${server.name}?`,
              async () => {
                if (!api) return;
                await api.servers.delete(server.id);
                router.back();
              },
              true,
            )
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  line: { marginVertical: 2, color: '#333' },
  actions: { gap: 8, marginTop: 8 },
});
