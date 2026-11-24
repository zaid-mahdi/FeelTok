// Friend List tab: a placeholder until its design is ready.
import { Redirect } from "expo-router";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import { useAuth } from "../../src/features/auth/AuthContext";

// Shows the Friend List placeholder. Logged-out users are sent to login.
export default function FriendsScreen() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <PlaceholderPage name="Friend List" />;
}
