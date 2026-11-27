// Admin sign-in form: the title, email and password fields, Reset password,
// the Sign in button and the admins-only note.
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ErrorText from "../../../components/ErrorText";
import PrimaryButton from "../../../components/PrimaryButton";
import TextField from "../../../components/TextField";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { friendlyError } from "../../../utils/errors";
import { validateLogin } from "../../../utils/validation";
import { logIn } from "../../auth/authService";
import PasswordField from "../../auth/PasswordField";

// Shows the admin sign-in form and signs the admin in. Takes
// signedInUsername: the username of a logged-in user who is not an admin, so
// the form can tell them (they stay logged in to the app).
export default function AdminSignInForm({ signedInUsername }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Opens the forgot password page.
  function handleResetPassword() {
    router.push("/forgot-password");
  }

  // Takes a non-admin back to the normal app.
  function handleBackToApp() {
    router.replace("/");
  }

  // Checks the fields, then signs in. If the account is an admin, the admin
  // page shows the dashboard; if not, it shows the "not an admin" message.
  async function handleSubmit() {
    if (isSubmitting) return;

    const validationMessage = validateLogin(email, password);
    setErrorMessage(validationMessage);
    if (validationMessage) return;

    setIsSubmitting(true);
    try {
      await logIn(email, password);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
    setIsSubmitting(false);
  }

  return (
    <View>
      <Text style={styles.title}>Admin sign in</Text>
      <Text style={styles.subtitle}>Use your FeelTok staff account.</Text>

      {signedInUsername && (
        <View style={styles.notAdmin}>
          <ErrorText
            message={`You're logged in as @${signedInUsername}, which is not an admin account. Sign in with an admin account below.`}
          />
          <Text
            style={styles.link}
            onPress={handleBackToApp}
            accessibilityRole="link"
          >
            Back to FeelTok
          </Text>
        </View>
      )}

      <View style={styles.fields}>
        <TextField
          label="Work email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@feeltok.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </View>

      <View style={styles.optionsRow}>
        <Pressable
          onPress={handleResetPassword}
          accessibilityRole="link"
          accessibilityLabel="Reset password"
          hitSlop={10}
        >
          <Text style={styles.link}>Reset password</Text>
        </Pressable>
      </View>

      <ErrorText message={errorMessage} />

      <PrimaryButton
        title="Sign in"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />

      {/* The designer's text also promised logged sign-ins and two-step
          verification. The team removed that part because FeelTok has neither. */}
      <View style={styles.note}>
        <Image
          source={require("../../../../assets/images/icon-lock.svg")}
          style={styles.noteIcon}
        />
        <Text style={styles.noteText}>
          Restricted to authorised administrators.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.ink,
  },
  subtitle: {
    marginTop: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.grey,
  },
  notAdmin: { gap: 8 },
  fields: { marginTop: 20, gap: 20 },
  optionsRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.purple,
  },
  note: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
  },
  noteIcon: { width: 15, height: 15, marginTop: 2 },
  noteText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.grey,
  },
});
