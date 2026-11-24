// The Account settings pop-up, from the profile mockup (opened by ☰). For
// now only Log out works: changing the username, email and password comes in
// Task 16 (Settings), so those fields only show the current values.
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppModal from "../../components/AppModal";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import TextField from "../../components/TextField";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { MIN_PASSWORD_LENGTH } from "../../utils/validation";
import PasswordField from "../auth/PasswordField";
import { logOut } from "../auth/authService";

// Takes the user's profile, their email and a function that closes the
// pop-up.
export default function AccountSettingsModal({ profile, email, onClose }) {
  const [errorMessage, setErrorMessage] = useState(null);

  // Logs out. The Profile tab then goes to Home.
  async function handleLogOutPress() {
    try {
      await logOut();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  return (
    <AppModal isVisible title="Account settings" onClose={onClose}>
      <View style={styles.fields}>
        <TextField label="Username" value={profile.username} editable={false} />
        <TextField label="Email" value={email ?? ""} editable={false} />
        <PasswordField
          label="New password"
          placeholder="Leave blank to keep current"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          editable={false}
        />
      </View>
      <PrimaryButton title="Save changes" isDisabled style={styles.saveButton} />

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
      <ErrorText message={errorMessage} />
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
});
