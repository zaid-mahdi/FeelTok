// Admin page (/admin): the admin sign-in form, or the admin dashboard once an
// admin is signed in. The dashboard is a placeholder until Task 17.
import { useState } from "react";
import { Button, Text } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import AdminAuthLayout from "../../src/features/admin/AdminAuthLayout";
import AdminSignInForm from "../../src/features/admin/AdminSignInForm";
import { useAuth } from "../../src/features/auth/AuthContext";
import { logOut } from "../../src/features/auth/authService";
import { friendlyError } from "../../src/utils/errors";

// Shows the dashboard to admins and the sign-in form to everyone else. A
// logged-in user who is not an admin sees a message and stays logged in.
export default function AdminScreen() {
  const { user, profile, isAdmin, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (isAdmin) return <AdminDashboardPlaceholder username={profile.username} />;

  const signedInUsername = user ? (profile?.username ?? user.email) : null;
  return (
    <AdminAuthLayout>
      <AdminSignInForm signedInUsername={signedInUsername} />
    </AdminAuthLayout>
  );
}

// Temporary dashboard: shows which admin is signed in and a plain log out
// button, so the team can test the admin sign-in. Takes the admin's username.
function AdminDashboardPlaceholder({ username }) {
  const [errorMessage, setErrorMessage] = useState(null);

  // Logs out. The admin page then shows the sign-in form again.
  async function handleLogOut() {
    try {
      await logOut();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  return (
    <PlaceholderPage name="Admin dashboard">
      <Text>Signed in as admin @{username}</Text>
      <Button title="Log out" onPress={handleLogOut} />
      <ErrorText message={errorMessage} />
    </PlaceholderPage>
  );
}
