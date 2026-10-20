import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';

const ITEMS = [
  { label: 'Accounts', route: '/(tabs)/more/accounts' },
  { label: 'Floating IPs', route: '/(tabs)/more/floating-ips' },
  { label: 'Primary IPs', route: '/(tabs)/more/primary-ips' },
  { label: 'SSH Keys', route: '/(tabs)/more/ssh-keys' },
  { label: 'Images', route: '/(tabs)/more/images' },
  { label: 'Locations', route: '/(tabs)/more/locations' },
  { label: 'Server Types', route: '/(tabs)/more/server-types' },
  { label: 'Placement Groups', route: '/(tabs)/more/placement-groups' },
  { label: 'Pricing', route: '/(tabs)/more/pricing' },
];

export default function MoreScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {ITEMS.map((it) => (
        <Pressable key={it.label} onPress={() => router.push(it.route as any)} style={styles.item}>
          <Text style={styles.label}>{it.label}</Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  label: { fontSize: 16 },
  chev: { fontSize: 20, color: '#999' },
});
