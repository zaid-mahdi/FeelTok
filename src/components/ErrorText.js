// Shared error message.
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows an error message in red. Takes the message, and shows nothing when
// there is none.
export default function ErrorText({ message }) {
  if (!message) return null;
  return (
    <Text style={styles.text} accessibilityRole="alert">
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.error,
    marginTop: 12,
  },
});
