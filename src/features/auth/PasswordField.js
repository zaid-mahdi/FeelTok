// Password field shared by the login and sign up forms.
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import TextField from "../../components/TextField";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows a text field that hides what is typed, with a Show/Hide button. Takes
// the same props as TextField.
export default function PasswordField(fieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const fieldName = fieldProps.label.toLowerCase();

  // Switches the password between hidden and readable text.
  function handleTogglePassword() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  return (
    <TextField
      {...fieldProps}
      secureTextEntry={!isPasswordVisible}
      autoCapitalize="none"
      autoCorrect={false}
      inputAction={
        <Pressable
          onPress={handleTogglePassword}
          accessibilityRole="button"
          accessibilityLabel={
            isPasswordVisible ? `Hide ${fieldName}` : `Show ${fieldName}`
          }
          hitSlop={12}
        >
          <Text style={styles.toggleText}>
            {isPasswordVisible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  toggleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.purple,
  },
});
