// New post page: opens full screen when the Create tab is tapped.
import { Redirect, router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CloseButton from "../src/components/CloseButton";
import ErrorText from "../src/components/ErrorText";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuth } from "../src/features/auth/AuthContext";
import NewPostForm from "../src/features/posts/NewPostForm";
import { COLORS } from "../src/theme/colors";
import { FONTS } from "../src/theme/fonts";

// Closes the page and goes back to Home.
function goHome() {
  router.dismissTo("/");
}

// Shows the header with ✕ and "New post", and the form. Logged-out users are
// sent to login.
export default function NewPostScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, profileError, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Redirect href="/login" />;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.closeButton}>
          <CloseButton onPress={goHome} accessibilityLabel="Close new post" />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          New post
        </Text>
      </View>

      {profile ? (
        <NewPostForm profile={profile} onPosted={goHome} />
      ) : (
        <View style={styles.message}>
          <ErrorText
            message={
              profileError
                ? "We couldn't load your profile. Please try again."
                : "Your account has no profile, so it can't post."
            }
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.inputBackground },
  header: {
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: COLORS.white,
    boxShadow: "0 4px 12px rgba(20, 18, 42, 0.05)",
    zIndex: 1,
  },
  closeButton: { position: "absolute", left: 16, bottom: 8 },
  title: {
    height: 44,
    fontFamily: FONTS.headingBold,
    fontSize: 20,
    lineHeight: 44,
    color: COLORS.ink,
  },
  message: { padding: 28 },
});
