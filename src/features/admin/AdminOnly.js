// Guard for the admin pages after sign-in: only admins see them; everyone
// else goes to /admin (the sign-in page).
import { Redirect } from "expo-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../auth/AuthContext";

// Takes the admin page as children and shows it only to a signed-in admin.
export default function AdminOnly({ children }) {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAdmin) return <Redirect href="/admin" />;
  return children;
}
