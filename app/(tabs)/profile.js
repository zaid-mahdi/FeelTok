// Profile tab: a placeholder until its design is ready. It also shows who is
// logged in and a plain log out button, so the team can test login.
import { useState } from "react";
import { Button, Text } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import { useAuth } from "../../src/features/auth/AuthContext";
import { logOut } from "../../src/features/auth/authService";
import { friendlyError } from "../../src/utils/errors";

// Shows the Profile placeholder with the temporary login test controls.
export default function ProfileScreen() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);

  // Logs out. The tab layout then sends the user back to login.
  async function handleLogOut() {
    try {
      await logOut();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  return (
    <PlaceholderPage name="Profile">
      <Text>Logged in as {user?.email}</Text>
      <Button title="Log out" onPress={handleLogOut} />
      <ErrorText message={errorMessage} />
    </PlaceholderPage>
  );
}
