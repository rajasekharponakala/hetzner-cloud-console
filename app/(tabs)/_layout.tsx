import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="servers" options={{ title: 'Servers', tabBarLabel: 'Servers' }} />
      <Tabs.Screen name="volumes" options={{ title: 'Volumes', tabBarLabel: 'Volumes' }} />
      <Tabs.Screen name="networks" options={{ title: 'Networks', tabBarLabel: 'Networks' }} />
      <Tabs.Screen name="firewalls" options={{ title: 'Firewalls', tabBarLabel: 'Firewalls' }} />
      <Tabs.Screen name="loadbalancers" options={{ title: 'Load Balancers', tabBarLabel: 'LBs' }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarLabel: 'More' }} />
    </Tabs>
  );
}
