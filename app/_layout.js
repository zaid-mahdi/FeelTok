// Root layout: Expo Router wraps every screen in this navigator.
// Screen groups such as (auth), (tabs) and admin get added here in later sprints.
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
