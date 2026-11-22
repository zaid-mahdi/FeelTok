// Shared layout of the login and forgot password pages, from the designer's
// mockups.
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows the logo, title, subtitle, the page's form (children) and the footer.
// If onBack is given, also shows a back button that calls it when pressed.
export default function AuthLayout({
  title,
  subtitle,
  footerQuestion,
  onBack,
  children,
}) {
  const insets = useSafeAreaInsets();

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
        <View style={styles.header}>
          {onBack && (
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to login"
            >
              <Image
                source={require("../../../assets/images/icon-back.svg")}
                style={styles.backIcon}
              />
            </Pressable>
          )}
          <Image
            source={require("../../../assets/images/feeltok-logo.svg")}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="FeelTok"
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {children}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {footerQuestion}{" "}
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

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  // The arrow lines up with the page text, inside a 44px touch area.
  backButton: {
    position: "absolute",
    left: -10,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { width: 24, height: 24 },
  // The logo SVG is 534 x 106, so we keep that ratio.
  logo: { width: 154, height: 154 * (106 / 534) },

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
