// Email field shared by the login, sign up and forgot password forms.
import TextField from "../../components/TextField";

// Shows the "Email" label and input. Takes the text, a function called when it
// changes, and an optional function called when the keyboard's enter is pressed.
export default function EmailField({ value, onChangeText, onSubmitEditing }) {
  return (
    <TextField
      label="Email"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      placeholder="you@example.com"
      keyboardType="email-address"
      autoComplete="email"
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
