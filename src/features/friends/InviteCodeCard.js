// The dark "Your invite code" card in the Invite pop-up, from the Friends
// mockup: the code as 6 coloured letters, and the Copy and Share buttons.
// Share is only the look from the mockup: it does nothing (team decision).
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// How long "Copied!" shows on the Copy button.
const COPIED_MESSAGE_MS = 2000;

// Takes the code (or null while loading), isLoading, an error message and a
// function to try again. Shows the code with Copy and Share, a spinner, or
// the error.
export default function InviteCodeCard({ code, isLoading, errorMessage, onRetry }) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimerRef = useRef(null);

  // Stops the "Copied!" timer when the pop-up closes.
  useEffect(() => () => clearTimeout(copiedTimerRef.current), []);

  // Puts the code on the clipboard and shows "Copied!" for 2 seconds. If the
  // browser doesn't allow copying, nothing happens.
  async function handleCopyPress() {
    try {
      await Clipboard.setStringAsync(code);
    } catch {
      return;
    }
    setIsCopied(true);
    clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setIsCopied(false), COPIED_MESSAGE_MS);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Your invite code</Text>

      {isLoading && <ActivityIndicator color={COLORS.white} style={styles.status} />}
      {!isLoading && errorMessage && (
        <View style={styles.status}>
          <Text style={styles.note}>{errorMessage}</Text>
          <Text style={styles.retry} onPress={onRetry} accessibilityRole="button">
            Try again
          </Text>
        </View>
      )}

      {!isLoading && code && (
        <>
          <View style={styles.letters} accessibilityLabel={`Your code is ${code}`}>
            {[...code].map((character, index) => (
              <View
                key={index}
                style={[
                  styles.letter,
                  { backgroundColor: index % 2 === 0 ? COLORS.pink : COLORS.purple },
                ]}
              >
                <Text style={styles.letterText}>{character}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttons}>
            <Pressable
              onPress={handleCopyPress}
              accessibilityRole="button"
              accessibilityLabel="Copy code"
              style={({ pressed }) => [styles.button, styles.copyButton, pressed && styles.copyButtonPressed]}
            >
              <Image
                source={require("../../../assets/images/icon-copy-white.svg")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{isCopied ? "Copied!" : "Copy"}</Text>
            </Pressable>
            <View style={[styles.button, styles.shareButton]}>
              <Image
                source={require("../../../assets/images/icon-share-white.svg")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Share</Text>
            </View>
          </View>
        </>
      )}

      <Text style={styles.note}>
        Each code works once. A new one is made after a friend uses it.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingTop: 18,
    borderRadius: 20,
    backgroundColor: COLORS.ink,
    alignItems: "center",
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.white,
  },
  status: { minHeight: 52, marginTop: 12, justifyContent: "center", alignItems: "center" },
  retry: {
    marginTop: 6,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.white,
    textDecorationLine: "underline",
  },
  letters: { flexDirection: "row", gap: 8, marginTop: 12 },
  letter: {
    width: 40,
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.white,
  },
  buttons: { flexDirection: "row", gap: 10, marginTop: 16, alignSelf: "stretch" },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  copyButton: { borderWidth: 1, borderColor: COLORS.panelBorder },
  copyButtonPressed: { backgroundColor: COLORS.adminBadge },
  shareButton: { backgroundColor: COLORS.pink },
  buttonIcon: { width: 18, height: 18, marginRight: 8 },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
  note: {
    marginTop: 12,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.panelText,
    textAlign: "center",
  },
});
