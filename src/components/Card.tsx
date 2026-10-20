import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});
