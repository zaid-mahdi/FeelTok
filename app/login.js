// Login screen: the designer's layout around the login form. The "Create your
// story" link is connected in Task 2.
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuth } from "../src/features/auth/AuthContext";
import LoginForm from "../src/features/auth/LoginForm";
import { COLORS } from "../src/theme/colors";
import { FONTS } from "../src/theme/fonts";

// Shows the login page. Users who are already logged in, or who just logged
// in, are sent to Home.
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (user) return <Redirect href="/" />;

  // Keep the mockup's spacing, but never go under the notch or home bar.
  const screenPadding = {
    paddingTop: Math.max(insets.top + 12, 58),
    paddingBottom: Math.max(insets.bottom + 12, 36),
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, screenPadding]}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/images/feeltok-logo.svg")}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="FeelTok"
        />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Log in to share how you feel and spread a smile today.
        </Text>

        <LoginForm />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to FeelTok?{" "}
            <Text style={styles.footerLink} accessibilityRole="link">
              Create your story
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    width: "100%",
    maxWidth: 480, // keeps it phone-sized when opened on the web
    alignSelf: "center",
  },

  // The logo SVG is 534 x 106, so we keep that ratio.
  logo: {
    width: 154,
    height: 154 * (106 / 534),
    alignSelf: "center",
    marginBottom: 48,
  },

  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: COLORS.ink,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.grey,
    marginBottom: 34,
  },

  // Takes the remaining height so its text sits at the bottom of the screen.
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 40,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.grey,
  },
  footerLink: { fontFamily: FONTS.semiBold, color: COLORS.purple },
});
