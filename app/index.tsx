import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { getActiveAccount } from '@/auth/accounts';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  useEffect(() => {
    getActiveAccount().then((a) => {
      setHasAccount(!!a);
      setReady(true);
    });
  }, []);
  if (!ready)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  if (hasAccount) return <Redirect href="/(tabs)/servers" />;
  return <Redirect href="/(auth)/token" />;
}
