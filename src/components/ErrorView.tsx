import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? <Button title="Retry" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { color: '#b00020', marginBottom: 12, textAlign: 'center' },
});
