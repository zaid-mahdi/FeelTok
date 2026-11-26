// The "Delete your account?" box in Account settings, from its mockup: a
// light pink box with the warning, a password field, and Cancel / Delete
// account (grey until a password is typed).
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import PasswordField from "../auth/PasswordField";

// Takes a function that deletes the account with the typed password (it
// throws if that fails) and a function for Cancel.
export default function DeleteAccountBox({ onDelete, onCancel }) {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const canDelete = password.length > 0 && !isDeleting;

  // Deletes the account. On success the page moves on, so only a failure
  // changes this box.
  async function handleDeletePress() {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await onDelete(password);
    } catch (error) {
      setErrorMessage(friendlyError(error));
      setIsDeleting(false);
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Delete your account?</Text>
      <Text style={styles.text}>
        This permanently deletes your profile, posts, comments, reactions, friends and
        messages. It can't be undone. Enter your password to confirm.
      </Text>
      <View style={styles.field}>
        <PasswordField
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage(null);
          }}
          placeholder="Enter your password"
          editable={!isDeleting}
        />
      </View>
      <ErrorText message={errorMessage} />
      {isDeleting && <Text style={styles.progress}>Deleting everything… this can take a moment.</Text>}
      <View style={styles.buttons}>
        <Pressable
          onPress={onCancel}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.cancelButtonPressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleDeletePress}
          disabled={!canDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
          aria-disabled={!canDelete}
          style={({ pressed }) => [
            styles.button,
            canDelete || isDeleting ? styles.deleteButton : styles.deleteButtonDisabled,
            pressed && styles.deleteButtonPressed,
          ]}
        >
          {isDeleting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={[styles.deleteText, !canDelete && styles.deleteTextDisabled]}>
              Delete account
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    backgroundColor: COLORS.lightPink,
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.error,
  },
  text: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.ink,
  },
  field: { marginTop: 14 },
  progress: {
    marginTop: 10,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  buttons: { flexDirection: "row", gap: 10, marginTop: 14 },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  cancelButtonPressed: { backgroundColor: COLORS.inputBackground },
  deleteButton: { backgroundColor: COLORS.error },
  deleteButtonDisabled: { backgroundColor: COLORS.border },
  deleteButtonPressed: { opacity: 0.85 },
  cancelText: { fontFamily: FONTS.semiBold, fontSize: 15, lineHeight: 20, color: COLORS.ink },
  deleteText: { fontFamily: FONTS.semiBold, fontSize: 15, lineHeight: 20, color: COLORS.white },
  deleteTextDisabled: { color: COLORS.grey },
});
