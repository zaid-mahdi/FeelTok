// Shared back button, from the designer's mockups.
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

// Shows a light round button with a back arrow. Takes a function to call when
// pressed and a label for screen readers.
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
    borderRadius: 22,
    backgroundColor: COLORS.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: { backgroundColor: COLORS.border },
  icon: { width: 20, height: 20 },
});
