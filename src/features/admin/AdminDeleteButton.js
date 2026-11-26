// The light pink "Delete" button with a trash icon, from the admin mockups.
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the button text, a function for pressing it, and the screen reader
// label.
export default function AdminDeleteButton({ title = "Delete", onPress, accessibilityLabel }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ hovered }) => [styles.button, hovered && styles.buttonHovered]}
    >
      <Image source={require("../../../assets/images/icon-trash.svg")} style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 34,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.lightPink,
  },
  buttonHovered: { backgroundColor: COLORS.dangerBorder },
  icon: { width: 15, height: 15, marginRight: 6 },
  text: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.error },
});
