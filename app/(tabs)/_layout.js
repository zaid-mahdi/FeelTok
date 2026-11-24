// Tab bar: Home, Friend List, Create, Mood and Profile (from the For You
// feed mockup). Home is open to everyone; the other tabs need a login.
import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import AppTabBar from "../../src/components/AppTabBar";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";

// Shows the 5 tabs. Logged-out users can use Home; tapping any other tab
// sends them to login.
export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  // Sends logged-out users to login instead of opening the tab.
  function handleLoginOnlyTabPress(event) {
    if (user) return;
    event.preventDefault();
    router.push("/login");
  }

  // Opens the full-screen New post page instead of switching to the Create
  // tab (or login, for logged-out users).
  function handleCreateTabPress(event) {
    event.preventDefault();
    router.push(user ? "/new-post" : "/login");
  }

  return (
    <Tabs tabBar={(props) => <AppTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="friends"
        options={{ title: "Friend List" }}
        listeners={{ tabPress: handleLoginOnlyTabPress }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: "Create" }}
        listeners={{ tabPress: handleCreateTabPress }}
      />
      <Tabs.Screen
        name="mood"
        options={{ title: "Mood" }}
        listeners={{ tabPress: handleLoginOnlyTabPress }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
        listeners={{ tabPress: handleLoginOnlyTabPress }}
      />
    </Tabs>
  );
}
