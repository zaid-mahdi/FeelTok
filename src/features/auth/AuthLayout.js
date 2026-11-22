// Shared layout of the login, sign up and forgot password pages, from the
// designer's mockups.
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows the logo, title, subtitle, the page's form (children) and the footer
// with its link. If onBack is given, also shows a back button. isCompact uses
// less space above the form, for pages with many fields.
export default function AuthLayout({
  title,
  subtitle,
  footerQuestion,
  footerLinkText,
  onFooterLinkPress,
  onBack,
  isCompact = false,
  children,
}) {
  const insets = useSafeAreaInsets();

  // Keep the mockup's spacing, but never go under the notch or home bar.
  const screenPadding = {
    paddingTop: Math.max(insets.top + 5, 51),
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
        <View style={[styles.header, isCompact && styles.headerCompact]}>
          {onBack && (
            <View style={styles.backButton}>
              <BackButton onPress={onBack} accessibilityLabel="Back to login" />
            </View>
          )}
          <Image
            source={require("../../../assets/images/feeltok-logo.svg")}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="FeelTok"
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
          {subtitle}
        </Text>

        {children}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {footerQuestion}{" "}
            <Text
              style={styles.footerLink}
              onPress={onFooterLinkPress}
              accessibilityRole="link"
            >
              {footerLinkText}
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

  // As tall as the back button, so the logo is in the same place on every page.
  header: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 42,
  },
  headerCompact: { marginBottom: 32 },
  backButton: { position: "absolute", left: 0 },
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
  subtitleCompact: { marginBottom: 28 },

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
