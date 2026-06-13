import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DataProvider } from '@/context/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transfer" />
        <Stack.Screen name="account/[id]/index" />
        <Stack.Screen name="account/[id]/transactions" />
        <Stack.Screen name="transaction/[id]" />
      </Stack>
    </DataProvider>
  );
}
