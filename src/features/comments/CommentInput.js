// The comment box from the comment mockup: "Say something kind..." and a
// round purple send button. The chat page reuses it with its own texts.
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { MAX_COMMENT_CHARACTERS } from "../../utils/validation";

// Takes a function called with the text when the user sends it. It returns a
// promise of true when the comment was saved: then the box empties. If it
// gives false, the text stays so the user can try again.
// Takes inputRef so the page can put the cursor in the box. Optional:
// placeholder, inputLabel and sendLabel (screen reader names), and maxLength.
export default function CommentInput({
  onSend,
  inputRef,
  placeholder = "Say something kind...",
  inputLabel = "Write a comment",
  sendLabel = "Send comment",
  maxLength = MAX_COMMENT_CHARACTERS,
}) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const canSend = text.trim().length > 0 && !isSending;

  // Sends the comment, then empties the box.
  async function handleSendPress() {
    if (!canSend) return;
    setIsSending(true);
    try {
      const isSaved = await onSend(text);
      if (isSaved) setText("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <View style={styles.row}>
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSendPress}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        maxLength={maxLength}
        accessibilityLabel={inputLabel}
        style={[styles.input, isFocused && styles.inputFocused]}
      />
      <Pressable
        onPress={handleSendPress}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel={sendLabel}
        aria-disabled={!canSend}
        style={({ pressed }) => [
          styles.sendButton,
          pressed && styles.sendButtonPressed,
          !canSend && styles.sendButtonDisabled,
        ]}
      >
        {isSending ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Image
            source={require("../../../assets/images/icon-send-white.svg")}
            style={styles.sendIcon}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.ink,
    // Hides the browser's own outline, because inputFocused replaces it.
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  inputFocused: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
  sendButton: {
    width: 44,
    height: 44,
    marginLeft: 10,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
  sendButtonPressed: { backgroundColor: COLORS.purpleDeep },
  sendButtonDisabled: { opacity: 0.5 },
  sendIcon: { width: 19, height: 19 },
});
