// Shared close (✕) button, from the New post mockup. Looks like BackButton.
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

// Shows a light round button with an ✕. Takes a function to call when
// pressed and a label for screen readers.
export default function CloseButton({ onPress, accessibilityLabel = "Close" }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Image
        source={require("../../assets/images/icon-close.svg")}
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
