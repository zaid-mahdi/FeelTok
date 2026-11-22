// Shared message for good or neutral news, such as "link sent".
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows a message. Takes the message, and shows nothing when there is none.
export default function NoticeText({ message }) {
  if (!message) return null;
  return (
    <Text style={styles.text} accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ink,
    marginTop: 12,
  },
});
