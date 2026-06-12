import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transfer" />
        <Stack.Screen name="account/[id]/index" />
        <Stack.Screen name="account/[id]/transactions" />
        <Stack.Screen name="transaction/[id]" />
      </Stack>
    </>
  );
}
