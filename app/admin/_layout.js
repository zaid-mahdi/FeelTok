// Admin area: web only. The mobile app has no admin area, so there it goes to
// Home.
import { Redirect, Stack } from "expo-router";
import { isWeb } from "../../src/utils/platform";

// Shows the admin pages in the browser, and sends the mobile app to Home.
export default function AdminLayout() {
  if (!isWeb) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
