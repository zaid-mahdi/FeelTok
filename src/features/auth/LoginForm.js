// Login form: the email and password fields and the Log in button.
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ErrorText from "../../components/ErrorText";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { validateLogin } from "../../utils/validation";
import { logIn } from "./authService";

// Shows the login fields and logs the user in. Takes no props: after a
// successful login, useAuth gets the user and the login screen closes itself.
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Switches the password between hidden and readable text.
  function handleTogglePassword() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  // Checks the fields, then logs in with Firebase. Shows a friendly message
  // if something is missing or wrong.
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
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.inputBox, styles.inputText]}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={COLORS.placeholder}
        accessibilityLabel="Email"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.passwordLabelRow}>
        <Text style={styles.label}>Password</Text>
        <Pressable accessibilityRole="link" hitSlop={10}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>
      <View style={[styles.inputBox, styles.passwordBox]}>
        <TextInput
          style={[styles.inputText, styles.passwordInput]}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.placeholder}
          accessibilityLabel="Password"
          secureTextEntry={!isPasswordVisible}
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSubmit}
        />
        <Pressable
          onPress={handleTogglePassword}
          accessibilityRole="button"
          accessibilityLabel={
            isPasswordVisible ? "Hide password" : "Show password"
          }
          hitSlop={12}
        >
          <Text style={styles.link}>{isPasswordVisible ? "Hide" : "Show"}</Text>
        </Pressable>
      </View>

      <ErrorText message={errorMessage} />

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Log in"
        style={({ pressed }) => [
          styles.primaryButton,
          (pressed || isSubmitting) && styles.primaryButtonDimmed,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.primaryButtonText}>Log in</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.purple,
  },

  inputBox: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 16,
  },
  inputText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.ink,
  },
  passwordBox: { flexDirection: "row", alignItems: "center", gap: 12 },
  passwordInput: { flex: 1, minWidth: 0, height: "100%" },

  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  primaryButtonDimmed: { opacity: 0.85 },
  primaryButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.white,
  },
});
