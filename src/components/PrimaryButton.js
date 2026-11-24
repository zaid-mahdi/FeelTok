// Shared purple button, from the designer's mockups.
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows a purple button that gets darker when pressed, or when the mouse is
// over it on the web. Takes its text and a function to call when pressed.
// While isLoading is true it shows a spinner, and while isDisabled is true it
// is grey. In both cases it can't be pressed. style changes its outer spacing.
export default function PrimaryButton({
  title,
  onPress,
  isLoading = false,
  isDisabled = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isLoading || isDisabled }}
      style={({ pressed, hovered }) => [
        styles.button,
        (pressed || hovered) && styles.buttonPressed,
        isLoading && styles.buttonLoading,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[styles.text, isDisabled && styles.textDisabled]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonPressed: { backgroundColor: COLORS.purpleDeep },
  buttonLoading: { opacity: 0.85 },
  buttonDisabled: { backgroundColor: COLORS.border },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
  textDisabled: { color: COLORS.grey },
});
