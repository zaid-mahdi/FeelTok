// Tab bar: Home, Create, Friends and Profile.
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";

// Shows the 4 tabs to logged-in users and sends everyone else to login.
// Temporary: Home becomes public in Task 7.
export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="friends" options={{ title: "Friends" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
