// Login form: the email and password fields and the Log in button.
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { validateLogin } from "../../utils/validation";
import { authFormStyles } from "./authFormStyles";
import { logIn } from "./authService";
import EmailField from "./EmailField";

// Shows the login fields and logs the user in. Takes no props: after a
// successful login, useAuth gets the user and the login screen closes itself.
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Switches the password between hidden and readable text.
  function handleTogglePassword() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  // Opens the forgot password page.
  function handleForgotPassword() {
    router.push("/forgot-password");
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
      <EmailField value={email} onChangeText={setEmail} />

      <View style={styles.passwordLabelRow}>
        <Text style={authFormStyles.label}>Password</Text>
        <Pressable
          onPress={handleForgotPassword}
          accessibilityRole="link"
          accessibilityLabel="Forgot password?"
          hitSlop={10}
        >
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>
      <View style={[authFormStyles.inputBox, styles.passwordBox]}>
        <TextInput
          style={[authFormStyles.inputText, styles.passwordInput]}
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

      <PrimaryButton
        title="Log in"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  passwordBox: { flexDirection: "row", alignItems: "center", gap: 12 },
  passwordInput: { flex: 1, minWidth: 0, height: "100%" },
});
