// Tab bar: Home, Create, Mood, Friends and Profile.
import { Redirect, router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";

// Opens the full-screen New post page instead of switching to the Create tab.
function handleCreateTabPress(event) {
  event.preventDefault();
  router.push("/new-post");
}

// Shows the 5 tabs to logged-in users and sends everyone else to login.
// Temporary: Home becomes public in Task 7.
export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="create"
        options={{ title: "Create" }}
        listeners={{ tabPress: handleCreateTabPress }}
      />
      <Tabs.Screen name="mood" options={{ title: "Mood" }} />
      <Tabs.Screen name="friends" options={{ title: "Friends" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
