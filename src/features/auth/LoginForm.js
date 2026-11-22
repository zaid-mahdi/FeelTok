// Login form: the email and password fields and the Log in button.
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { validateLogin } from "../../utils/validation";
import { logIn } from "./authService";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

// Shows the login fields and logs the user in. Takes no props: after a
// successful login, useAuth gets the user and the login screen closes itself.
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
      <View style={styles.fields}>
        <EmailField value={email} onChangeText={setEmail} />
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Enter your password"
          autoComplete="current-password"
          labelAction={
            <Pressable
              onPress={handleForgotPassword}
              accessibilityRole="link"
              accessibilityLabel="Forgot password?"
              hitSlop={10}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          }
        />
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
  fields: { gap: 18 },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.purple,
  },
});
