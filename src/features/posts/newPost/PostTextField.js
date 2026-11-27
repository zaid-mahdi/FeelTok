// The big text box of the New post page.
import { useState } from "react";
import { Platform, StyleSheet, TextInput } from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { MAX_POST_CHARACTERS } from "../../../utils/validation";

// Shows a tall white box that turns purple while the user types in it.
// Takes the text and a function called with the new text.
export default function PostTextField({ value, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);

  // Shows the focused style.
  function handleFocus() {
    setIsFocused(true);
  }

  // Goes back to the normal style.
  function handleBlur() {
    setIsFocused(false);
  }

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onFocus={handleFocus}
      onBlur={handleBlur}
      multiline
      maxLength={MAX_POST_CHARACTERS}
      textAlignVertical="top"
      placeholder="What's on your mind?"
      placeholderTextColor={COLORS.placeholder}
      accessibilityLabel="Your post"
      style={[styles.input, isFocused && styles.inputFocused]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 210,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
    // Hides the browser's own outline, because inputFocused replaces it.
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  inputFocused: {
    borderColor: COLORS.purple,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
});
