// Admin page (/admin): the admin sign-in form, or the admin dashboard
// (Task 17) once an admin is signed in.
import LoadingSpinner from "../../src/components/LoadingSpinner";
import AdminAuthLayout from "../../src/features/admin/signIn/AdminAuthLayout";
import AdminDashboard from "../../src/features/admin/dashboard/AdminDashboard";
import AdminSignInForm from "../../src/features/admin/signIn/AdminSignInForm";
import { useAuth } from "../../src/features/auth/AuthContext";

// Shows the dashboard to admins and the sign-in form to everyone else. A
// logged-in user who is not an admin sees a message and stays logged in.
export default function AdminScreen() {
  const { user, profile, isAdmin, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (isAdmin) return <AdminDashboard />;

  const signedInUsername = user ? (profile?.username ?? user.email) : null;
  return (
    <AdminAuthLayout>
      <AdminSignInForm signedInUsername={signedInUsername} />
    </AdminAuthLayout>
  );
}
