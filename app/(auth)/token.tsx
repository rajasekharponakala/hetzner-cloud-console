import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createApi } from '@/api';
import { addAccount } from '@/auth/accounts';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';

export default function TokenScreen() {
  const router = useRouter();
  const [label, setLabel] = useState('default');
  const [token, setToken] = useState('');
  const [validating, setValidating] = useState(false);

  const onSave = async () => {
    if (!token.trim()) {
      Alert.alert('Token required');
      return;
    }
    setValidating(true);
    try {
      const api = createApi(token.trim());
      await api.servers.list(1, 1);
      await addAccount(label.trim() || 'default', token.trim());
      router.replace('/(tabs)/servers');
    } catch (e: any) {
      Alert.alert('Invalid token', e?.message ?? 'Could not validate');
    } finally {
      setValidating(false);
    }
  };

  if (validating) return <Loading label="Validating token…" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hetzner Cloud Console</Text>
      <Text style={styles.subtitle}>Enter a project API token</Text>
      <TextInput placeholder="Label" value={label} onChangeText={setLabel} style={styles.input} />
      <TextInput
        placeholder="API token"
        value={token}
        onChangeText={setToken}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Validate & Save" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#555', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});
