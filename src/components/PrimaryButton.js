// Shared purple button, from the designer's mockups.
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows a purple button that gets darker when pressed, or when the mouse is
// over it on the web. Takes its text and a function to call when pressed.
// While isLoading is true it shows a spinner and can't be pressed.
export default function PrimaryButton({ title, onPress, isLoading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed, hovered }) => [
        styles.button,
        (pressed || hovered) && styles.buttonPressed,
        isLoading && styles.buttonLoading,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonPressed: { backgroundColor: COLORS.purpleDeep },
  buttonLoading: { opacity: 0.85 },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
});
