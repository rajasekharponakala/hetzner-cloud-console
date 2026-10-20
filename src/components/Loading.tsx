import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#D50C2D" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { marginTop: 12, color: '#555' },
});
