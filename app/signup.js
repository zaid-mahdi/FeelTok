// Sign up screen: the designer's layout around the sign up form.
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuth } from "../src/features/auth/AuthContext";
import AuthLayout from "../src/features/auth/AuthLayout";
import SignUpForm from "../src/features/auth/SignUpForm";

// Shows the sign up page, with a back button to login. Users who are logged
// in leave this page.
export default function SignUpScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Firebase logs the user in before the profile is saved, so we wait for the
  // whole sign up to finish. Going through login, which sends logged-in users
  // to Home, leaves no old page behind Home.
  const canLeave = Boolean(user) && !isSigningUp;
  useEffect(() => {
    if (canLeave) router.dismissTo("/login");
  }, [canLeave, router]);

  // Goes back to login, also when this page was opened directly. Does nothing
  // while an account is being created.
  function handleBackToLogin() {
    if (!isSigningUp) router.dismissTo("/login");
  }

  if (isLoading || canLeave) return <LoadingSpinner />;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join FeelTok and start sharing how you feel."
      footerQuestion="Already have an account?"
      footerLinkText="Log in"
      onFooterLinkPress={handleBackToLogin}
      onBack={handleBackToLogin}
      isCompact
    >
      <SignUpForm
        isSubmitting={isSigningUp}
        onSubmittingChange={setIsSigningUp}
      />
    </AuthLayout>
  );
}
