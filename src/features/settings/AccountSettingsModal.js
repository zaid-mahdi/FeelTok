// The Account settings pop-up (Task 16), from its mockup (opened by ☰ on
// Profile): change the username, email and password with one Save button,
// log out, and delete the account.
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppModal from "../../components/AppModal";
import ErrorText from "../../components/ErrorText";
import NoticeText from "../../components/NoticeText";
import PrimaryButton from "../../components/PrimaryButton";
import TextField from "../../components/TextField";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { MIN_PASSWORD_LENGTH, validateAccountChanges } from "../../utils/validation";
import PasswordField from "../auth/PasswordField";
import { logOut } from "../auth/authService";
import DeleteAccountBox from "./DeleteAccountBox";
import {
  changeEmail,
  changePassword,
  changeUsername,
  confirmCurrentPassword,
  deleteAccount,
} from "./accountService";

// Takes the user's profile, their email and a function that closes the
// pop-up.
export default function AccountSettingsModal({ profile, email, onClose }) {
  const [username, setUsername] = useState(profile.username);
  const [newEmail, setNewEmail] = useState(email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isUsernameChanged = username !== profile.username;
  const isEmailChanged = newEmail.trim().toLowerCase() !== (email ?? "").toLowerCase();
  const isPasswordChanged = newPassword.length > 0;
  const needsCurrentPassword = isEmailChanged || isPasswordChanged;
  const hasChanges = isUsernameChanged || isEmailChanged || isPasswordChanged;

  // Keeps a change in a field and clears old messages.
  function handleFieldChange(setValue) {
    return (text) => {
      setValue(text);
      setErrorMessage(null);
      setSuccessMessage(null);
    };
  }

  // Checks the changes, then saves them one by one: the username, the email
  // (a link is sent to the new address) and the password. The current
  // password is checked first when the email or password changes.
  async function handleSavePress() {
    const validationMessage = validateAccountChanges({
      username: isUsernameChanged ? username : null,
      email: isEmailChanged ? newEmail : null,
      newPassword: isPasswordChanged ? newPassword : null,
      currentPassword: needsCurrentPassword ? currentPassword : null,
    });
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    const doneMessages = [];
    try {
      if (needsCurrentPassword) await confirmCurrentPassword(currentPassword);
      if (isUsernameChanged) {
        await changeUsername(profile, username);
        doneMessages.push("Your username was changed.");
      }
      if (isEmailChanged) {
        await changeEmail(newEmail);
        doneMessages.push(
          `We sent a link to ${newEmail.trim()}. Your email changes after you open it. No email after a few minutes? Check your spam folder. If that address already has a FeelTok account, no link is sent.`,
        );
        setNewEmail(email ?? "");
      }
      if (isPasswordChanged) {
        await changePassword(newPassword);
        doneMessages.push("Your password was changed.");
        setNewPassword("");
      }
      setCurrentPassword("");
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setSuccessMessage(doneMessages.length > 0 ? doneMessages.join(" ") : null);
      setIsSaving(false);
    }
  }

  // Logs out. The Profile tab then goes to Home.
  async function handleLogOutPress() {
    try {
      await logOut();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  // Opens the "Delete your account?" box and clears old messages.
  function handleOpenDeletePress() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleteOpen(true);
  }

  // Deletes the account with everything in it, then goes to Home (logged
  // out). Throws if it fails, so the delete box shows the error.
  async function handleDeleteAccount(password) {
    await deleteAccount(profile, password);
    onClose();
    router.replace("/");
  }

  return (
    <AppModal isVisible title="Account settings" onClose={onClose}>
      <View style={styles.fields}>
        <TextField
          label="Username"
          value={username}
          onChangeText={handleFieldChange((text) => setUsername(text.trim().toLowerCase()))}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSaving}
        />
        <TextField
          label="Email"
          value={newEmail}
          onChangeText={handleFieldChange(setNewEmail)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!isSaving}
        />
        <PasswordField
          label="New password"
          value={newPassword}
          onChangeText={handleFieldChange(setNewPassword)}
          placeholder="Leave blank to keep current"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          editable={!isSaving}
        />
        {/* Not in the mockup: Firebase needs the current password before the
            email or password can change. */}
        {needsCurrentPassword && (
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChangeText={handleFieldChange(setCurrentPassword)}
            placeholder="Needed to change your email or password"
            editable={!isSaving}
          />
        )}
      </View>
      <ErrorText message={errorMessage} />
      <NoticeText message={successMessage} />
      <PrimaryButton
        title="Save changes"
        onPress={handleSavePress}
        isLoading={isSaving}
        isDisabled={!hasChanges}
        style={styles.saveButton}
      />

      <View style={styles.divider} />

      <Pressable
        onPress={handleLogOutPress}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={({ pressed }) => [
          styles.logOutButton,
          pressed && styles.logOutButtonPressed,
        ]}
      >
        <Image
          source={require("../../../assets/images/icon-logout.svg")}
          style={styles.logOutIcon}
        />
        <Text style={styles.logOutText}>Log out</Text>
      </Pressable>

      {isDeleteOpen ? (
        <DeleteAccountBox
          onDelete={handleDeleteAccount}
          onCancel={() => setIsDeleteOpen(false)}
        />
      ) : (
        <Text
          style={styles.deleteLink}
          onPress={handleOpenDeletePress}
          accessibilityRole="button"
        >
          Delete account
        </Text>
      )}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 16 },
  saveButton: { marginTop: 20 },
  divider: { height: 1, marginVertical: 20, backgroundColor: COLORS.border },
  logOutButton: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  logOutButtonPressed: { backgroundColor: COLORS.inputBackground },
  logOutIcon: { width: 20, height: 20, marginRight: 8 },
  logOutText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.error,
  },
  deleteLink: {
    alignSelf: "center",
    marginTop: 20,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.pinkDeep,
    textDecorationLine: "underline",
  },
});
