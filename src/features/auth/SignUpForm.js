// Sign up form: the email, username and password fields and the Sign up button.
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import TextField from "../../components/TextField";
import { friendlyError } from "../../utils/errors";
import { validateSignUp } from "../../utils/validation";
import { signUp } from "./authService";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

// Shows the sign up fields and creates the account. Takes isSubmitting and a
// function that changes it, because the sign up screen needs to know about it.
export default function SignUpForm({ isSubmitting, onSubmittingChange }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Checks the fields, then creates the account. Shows a friendly message if
  // something is missing or wrong.
  async function handleSubmit() {
    if (isSubmitting) return;

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
        <EmailField value={email} onChangeText={setEmail} />
        <TextField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Pick a username"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm password"
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          onSubmitEditing={handleSubmit}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
      </View>

      <ErrorText message={errorMessage} />

      <PrimaryButton
        title="Sign up"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({ fields: { gap: 16 } });
