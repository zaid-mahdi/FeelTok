// Login screen: the designer's layout around the login form.
import { Redirect, useRouter } from "expo-router";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuth } from "../src/features/auth/AuthContext";
import AuthLayout from "../src/features/auth/AuthLayout";
import LoginForm from "../src/features/auth/LoginForm";

// Shows the login page. Users who are already logged in, or who just logged
// in, are sent to Home.
export default function LoginScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Opens the sign up page.
  function handleSignUp() {
    router.push("/signup");
  }

  // The spinner shows only while the saved login is checked. During a new
  // login the form stays, so it can show an error (like a blocked account).
  if (isLoading && !user) return <LoadingSpinner />;
  if (user && !isLoading) return <Redirect href="/" />;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to share how you feel and spread a smile today."
      footerQuestion="New to FeelTok?"
      footerLinkText="Create your story"
      onFooterLinkPress={handleSignUp}
    >
      <LoginForm />
    </AuthLayout>
  );
}
