import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { useActiveApi } from '@/hooks/useActiveApi';
import { loadAccounts, addAccount, removeAccount, setActiveId } from '@/auth/accounts';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function AccountsScreen() {
  const { reload } = useActiveApi();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [label, setLabel] = useState('');
  const [token, setToken] = useState('');

  const refresh = async () => setAccounts(await loadAccounts());
  React.useEffect(() => {
    refresh();
  }, []);

  const add = async () => {
    if (!token.trim()) {
      Alert.alert('Token required');
      return;
    }
    try {
      const { createApi } = await import('@/api');
      const api = createApi(token.trim());
      await api.servers.list(1, 1);
      await addAccount(label.trim() || 'account', token.trim());
      setLabel('');
      setToken('');
      await refresh();
      await reload();
    } catch (e: any) {
      Alert.alert('Invalid token', e?.message ?? 'bad');
    }
  };

  const remove = async (id: string) => {
    await removeAccount(id);
    await refresh();
    await reload();
  };

  const switchTo = async (id: string) => {
    await setActiveId(id);
    await reload();
  };

  return (
    <View style={styles.container}>
      <Card title="Add account">
        <TextInput placeholder="Label" value={label} onChangeText={setLabel} style={styles.input} />
        <TextInput
          placeholder="Token"
          value={token}
          onChangeText={setToken}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button title="Validate & Add" onPress={add} />
      </Card>
      <FlatList
        data={accounts}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => (
          <Card title={item.label}>
            <Text style={styles.meta}>{item.token.slice(0, 8)}…</Text>
            <View style={styles.row}>
              <Button title="Switch" variant="ghost" onPress={() => switchTo(item.id)} />
              <Button title="Remove" variant="danger" onPress={() => remove(item.id)} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 },
  meta: { color: '#777', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
});
