// Sign up form: the username, email and password fields, the Create account
// button and the terms text.
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import TextField from "../../components/TextField";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import {
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  validateSignUp,
} from "../../utils/validation";
import { signUp } from "./authService";
import PasswordField from "./PasswordField";

// Shows the sign up fields and creates the account. Takes isSubmitting and a
// function that changes it, because the sign up screen needs to know about it.
export default function SignUpForm({ isSubmitting, onSubmittingChange }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // The button stays grey until every field has something in it.
  const hasFilledAllFields = Boolean(
    username && email && password && confirmedPassword,
  );

  // Checks the fields, then creates the account. Shows a friendly message if
  // something is wrong.
  async function handleSubmit() {
    if (isSubmitting || !hasFilledAllFields) return;

    // Phone keyboards often add a space after a suggested word.
    const trimmedUsername = username.trim();
    const validationMessage = validateSignUp(
      email,
      trimmedUsername,
      password,
      confirmedPassword,
    );
    setErrorMessage(validationMessage);
    if (validationMessage) return;

    onSubmittingChange(true);
    try {
      await signUp(email, trimmedUsername, password);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
    onSubmittingChange(false);
  }

  return (
    <View>
      <View style={styles.fields}>
        <TextField
          label="Username"
          value={username}
          onChangeText={setUsername}
          prefix="@"
          placeholder="your_name"
          hint={`${MIN_USERNAME_LENGTH}–${MAX_USERNAME_LENGTH} characters: lowercase letters, numbers or _`}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          isCompact
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          isCompact
        />
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          hint={`Use ${MIN_PASSWORD_LENGTH} or more characters`}
          autoComplete="new-password"
          isCompact
        />
        <TextField
          label="Confirm password"
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Type it again"
          secureTextEntry
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          isCompact
        />
      </View>

      <ErrorText message={errorMessage} />

      <PrimaryButton
        title="Create account"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        isDisabled={!hasFilledAllFields}
      />

      <Text style={styles.terms}>
        By signing up you agree to FeelTok’s{" "}
        <Text style={styles.termsLink}>Terms</Text> and{" "}
        <Text style={styles.termsLink}>Community guidelines</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 16 },
  // The team decided the Terms and Community guidelines are not links yet.
  terms: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.grey,
  },
  termsLink: {
    fontFamily: FONTS.semiBold,
    color: COLORS.purple,
    textDecorationLine: "underline",
  },
});
