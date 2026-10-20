import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const COLORS: Record<string, string> = {
  running: '#2e7d32',
  off: '#757575',
  error: '#b00020',
  initializing: '#ef6c00',
  starting: '#ef6c00',
  stopping: '#ef6c00',
};

export function Badge({ label }: { label: string }) {
  const bg = COLORS[label] ?? '#555';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
