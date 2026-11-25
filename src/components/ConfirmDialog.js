// Shared confirm pop-up, from the remove friend mockup: an emoji in a light
// pink circle, a question, a short explanation, and Cancel / a red confirm
// button. It works the same on phones and in the browser.
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

// Takes isVisible, the emoji, the title (the question), the message, the
// confirm button's text, isConfirming (shows a spinner and blocks the
// buttons while the action runs), and the onConfirm and onCancel functions.
// Tapping the dimmed page or the phone's back button also cancels.
export default function ConfirmDialog({
  isVisible,
  emoji,
  title,
  message,
  confirmText,
  isConfirming = false,
  onConfirm,
  onCancel,
}) {
  // Cancels, unless the action is already running.
  function handleCancel() {
    if (!isConfirming) onCancel();
  }

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.page}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleCancel}
          accessibilityLabel="Cancel"
        />
        <View style={styles.card} role="alertdialog" aria-label={title}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={handleCancel}
              disabled={isConfirming}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.cancelButtonPressed]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={isConfirming}
              accessibilityRole="button"
              accessibilityLabel={confirmText}
              style={({ pressed }) => [styles.button, styles.confirmButton, pressed && styles.confirmButtonPressed]}
            >
              {isConfirming ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.backdrop,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 24,
    borderRadius: 24,
    backgroundColor: COLORS.white,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPink,
  },
  emoji: { fontSize: 32, lineHeight: 40 },
  title: {
    marginTop: 14,
    fontFamily: FONTS.headingBold,
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.ink,
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.grey,
    textAlign: "center",
  },
  buttons: { flexDirection: "row", gap: 10, marginTop: 20, alignSelf: "stretch" },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  cancelButtonPressed: { backgroundColor: COLORS.inputBackground },
  confirmButton: { backgroundColor: COLORS.error },
  confirmButtonPressed: { opacity: 0.85 },
  cancelText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.ink,
  },
  confirmText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
});
