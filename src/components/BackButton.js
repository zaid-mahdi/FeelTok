// Shared back button, from the designer's mockups.
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

// Shows a white box with a back arrow. Takes a function to call when pressed
// and a label for screen readers.
export default function BackButton({ onPress, accessibilityLabel = "Back" }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Image
        source={require("../../assets/images/icon-back.svg")}
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: { backgroundColor: COLORS.inputBackground },
  icon: { width: 20, height: 20 },
});
