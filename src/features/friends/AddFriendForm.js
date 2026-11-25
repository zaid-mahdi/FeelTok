// "Got a friend's code?" in the Invite pop-up, from the Friends mockup: a code
// box and an "Add friend" button that makes the two users friends.
import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import NoticeText from "../../components/NoticeText";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import {
  INVITE_CODE_LENGTH,
  normalizeInviteCode,
  validateInviteCode,
} from "../../utils/validation";
import { fetchProfile } from "../profile/profileService";
import { redeemInviteCode } from "./friendService";

// Takes a friend's user ID and returns the success message, with their
// username when it can be loaded.
async function getFriendAddedMessage(friendUid) {
  try {
    const friendProfile = await fetchProfile(friendUid);
    if (friendProfile) return `You're now friends with @${friendProfile.username}!`;
  } catch {
    // The friendship is saved; only the name couldn't be loaded.
  }
  return "You're now friends!";
}

// Takes the logged-in user's ID and an optional onFriendAdded function,
// called after a friend is added. Shows the code box, the button, and an
// error or success message.
export default function AddFriendForm({ uid, onFriendAdded }) {
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Keeps the code in capitals without spaces, and clears old messages.
  function handleCodeChange(text) {
    setCode(normalizeInviteCode(text));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  // Checks the code, then makes the two users friends.
  async function handleAddFriendPress() {
    const validationMessage = validateInviteCode(code);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const friendUid = await redeemInviteCode(uid, code);
      setCode("");
      setSuccessMessage(await getFriendAddedMessage(friendUid));
      onFriendAdded?.(friendUid);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Got a friend's code?</Text>
      <View style={styles.row}>
        <TextInput
          value={code}
          onChangeText={handleCodeChange}
          onSubmitEditing={handleAddFriendPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="E.G. AB12CD"
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={INVITE_CODE_LENGTH}
          accessibilityLabel="Friend's code"
          style={[styles.input, isFocused && styles.inputFocused]}
        />
        <PrimaryButton
          title="Add friend"
          onPress={handleAddFriendPress}
          isLoading={isSaving}
          style={styles.button}
        />
      </View>
      <ErrorText message={errorMessage} />
      <NoticeText message={successMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 24 },
  label: {
    marginBottom: 10,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.ink,
  },
  row: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    letterSpacing: 3,
    color: COLORS.ink,
    // Hides the browser's own outline, because inputFocused replaces it.
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  inputFocused: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
  button: { marginTop: 0, paddingHorizontal: 22 },
});
