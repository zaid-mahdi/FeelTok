// Mood tab: where users will change their current mood (Task 11). A
// placeholder until then.
import { Redirect } from "expo-router";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import { useAuth } from "../../src/features/auth/AuthContext";

// Shows the Mood placeholder. Logged-out users are sent to login.
export default function MoodScreen() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <PlaceholderPage name="Mood" />;
}
