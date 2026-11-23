// Shared text field with a label, from the designer's design system.
import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Shows a label and an input that turns purple while the user types in it.
// Takes the label, optional labelAction (shown at the end of the label row),
// optional prefix (fixed text before the input, like "@"), optional
// inputAction (shown inside the input), optional hint (small text below),
// isCompact (the slightly smaller sign up size) and any TextInput props.
export default function TextField({
  label,
  labelAction,
  prefix,
  inputAction,
  hint,
  isCompact = false,
  ...inputProps
}) {
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
    <View>
      <View style={[styles.labelRow, isCompact && styles.labelRowCompact]}>
        <Text style={styles.label}>{label}</Text>
        {labelAction}
      </View>
      <View
        style={[
          styles.box,
          isCompact && styles.boxCompact,
          isFocused && styles.boxFocused,
        ]}
      >
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          {...inputProps}
          style={[styles.input, prefix && styles.inputAfterPrefix]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.placeholder}
          accessibilityLabel={label}
          accessibilityHint={hint}
        />
        {inputAction && <View style={styles.inputAction}>{inputAction}</View>}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelRowCompact: { marginBottom: 5 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
  },
  box: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  boxCompact: { height: 50 },
  boxFocused: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
  prefix: {
    paddingLeft: 16,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.placeholder,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.ink,
    // Hides the browser's own outline, because boxFocused replaces it.
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  inputAfterPrefix: { paddingLeft: 6 },
  inputAction: { paddingRight: 16 },
  hint: {
    marginTop: 7,
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
});
