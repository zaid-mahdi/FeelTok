// Email field shared by the login and forgot password forms.
import { Text, TextInput, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { authFormStyles } from "./authFormStyles";

// Shows the "Email" label and input. Takes the text, a function called when it
// changes, and an optional function called when the keyboard's enter is pressed.
export default function EmailField({ value, onChangeText, onSubmitEditing }) {
  return (
    <View>
      <Text style={authFormStyles.label}>Email</Text>
      <TextInput
        style={[authFormStyles.inputBox, authFormStyles.inputText]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder="you@example.com"
        placeholderTextColor={COLORS.placeholder}
        accessibilityLabel="Email"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
