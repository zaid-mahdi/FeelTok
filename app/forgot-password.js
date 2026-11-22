// Forgot password screen: the designer's layout around the reset form.
import { useRouter } from "expo-router";
import AuthLayout from "../src/features/auth/AuthLayout";
import ForgotPasswordForm from "../src/features/auth/ForgotPasswordForm";

// Shows the forgot password page, with a back button to login.
export default function ForgotPasswordScreen() {
  const router = useRouter();

  // Goes back to login, also when this page was opened directly.
  function handleBack() {
    router.dismissTo("/login");
  }

  // Opens the sign up page.
  function handleSignUp() {
    router.push("/signup");
  }

  return (
    <AuthLayout
      title="Forgot your login?"
      subtitle="Enter your registered email to get a password reset link."
      footerQuestion="Don't have an account?"
      footerLinkText="Create your story"
      onFooterLinkPress={handleSignUp}
      onBack={handleBack}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
