// Root layout: loads the fonts and gives every screen the login state.
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../src/features/auth/AuthContext";
import { fontAssets } from "../src/theme/fonts";

// Keep the splash screen up until the fonts are ready, so text never
// flashes in the wrong font.
SplashScreen.preventAutoHideAsync();

// Shows the current screen once the fonts are loaded.
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // If a font fails to load we still show the app (with the fallback font).
  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
