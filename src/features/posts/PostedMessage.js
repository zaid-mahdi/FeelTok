// The short "Posted" message on Home after the user creates a post. Not in
// the mockups yet, so it is kept simple.
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

const SHOWN_FOR_MS = 3000;

// Takes isVisible and a function called when the message should go away
// (after 3 seconds). Shows nothing while isVisible is false.
export default function PostedMessage({ isVisible, onHide }) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onHide, SHOWN_FOR_MS);
    return () => clearTimeout(timer);
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <View style={styles.message} accessibilityLiveRegion="polite" role="status">
      <Text style={styles.text}>Posted! Your post is now in the feed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.successTint,
    boxShadow: "0 4px 12px rgba(20, 18, 42, 0.08)",
    zIndex: 2,
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.success,
  },
});
