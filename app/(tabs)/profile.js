// Profile tab: a placeholder until its design is ready. It also shows who is
// logged in and a plain log out button, so the team can test login.
import { Redirect } from "expo-router";
import { useState } from "react";
import { Button, Text } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import { useAuth } from "../../src/features/auth/AuthContext";
import { logOut } from "../../src/features/auth/authService";
import { friendlyError } from "../../src/utils/errors";

// Shows the Profile placeholder with the temporary login test controls.
// Without a login (for example right after logging out) it goes to Home.
export default function ProfileScreen() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);

  // Logs out. The page then goes to Home (see below).
  async function handleLogOut() {
    try {
      await logOut();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  if (!user) return <Redirect href="/" />;

  return (
    <PlaceholderPage name="Profile">
      <Text>Logged in as {user?.email}</Text>
      <Button title="Log out" onPress={handleLogOut} />
      <ErrorText message={errorMessage} />
    </PlaceholderPage>
  );
}
