// Login screen: the designer's layout around the login form.
import { Redirect } from "expo-router";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuth } from "../src/features/auth/AuthContext";
import AuthLayout from "../src/features/auth/AuthLayout";
import LoginForm from "../src/features/auth/LoginForm";

// Shows the login page. Users who are already logged in, or who just logged
// in, are sent to Home.
export default function LoginScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (user) return <Redirect href="/" />;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to share how you feel and spread a smile today."
      footerQuestion="New to FeelTok?"
    >
      <LoginForm />
    </AuthLayout>
  );
}
