// Shared purple button, from the designer's mockups.
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows a purple button. Takes its text and a function to call when pressed.
// While isLoading is true it shows a spinner and can't be pressed.
export default function PrimaryButton({ title, onPress, isLoading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        (pressed || isLoading) && styles.buttonDimmed,
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
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDimmed: { opacity: 0.85 },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.white,
  },
});
