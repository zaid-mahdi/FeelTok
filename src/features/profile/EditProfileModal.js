// The Edit profile pop-up, from the profile mockup: change photo and bio,
// then Save.
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppModal from "../../components/AppModal";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { pickPhoto, prepareProfilePhoto } from "../../utils/images";
import { MAX_BIO_LENGTH } from "../../utils/validation";
import Avatar from "./Avatar";
import { saveBio, saveProfilePhoto } from "./profileService";
import { rememberProfilePhoto } from "./useProfilePhoto";

const PREVIEW_SIZE = 72;

// Takes the user's profile and a function that closes the pop-up. A picked
// photo is only shown here until Save; Save stores the new photo and bio.
export default function EditProfileModal({ profile, onClose }) {
  const [bio, setBio] = useState(profile.bio);
  const [newPhoto, setNewPhoto] = useState(null);
  const [isPreparingPhoto, setIsPreparingPhoto] = useState(false);
  const [isBioFocused, setIsBioFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasBioChanged = bio.trim() !== profile.bio;

  // Lets the user pick a photo, then makes it a small square for the preview.
  async function handleChangePhotoPress() {
    setErrorMessage(null);
    try {
      const pickedPhoto = await pickPhoto({ isSquare: true });
      if (!pickedPhoto) return;
      setIsPreparingPhoto(true);
      setNewPhoto(await prepareProfilePhoto(pickedPhoto));
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsPreparingPhoto(false);
    }
  }

  // Saves what changed (the photo, the bio or both), then closes.
  async function handleSavePress() {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      if (newPhoto) {
        await saveProfilePhoto(profile.uid, newPhoto.base64);
        rememberProfilePhoto(
          profile.uid,
          `data:image/jpeg;base64,${newPhoto.base64}`,
        );
      }
      if (hasBioChanged) await saveBio(profile.uid, bio);
      onClose();
    } catch (error) {
      setErrorMessage(friendlyError(error));
      setIsSaving(false);
    }
  }

  return (
    <AppModal isVisible title="Edit profile" onClose={onClose}>
      <View style={styles.photoRow}>
        {newPhoto ? (
          <Image
            source={{ uri: newPhoto.uri }}
            style={styles.preview}
            accessibilityLabel="Your new photo"
          />
        ) : (
          <Avatar
            name={profile.username}
            uid={profile.uid}
            hasPhoto={profile.hasPhoto}
            moodKey={null}
            size={PREVIEW_SIZE}
          />
        )}
        <View style={styles.photoActions}>
          <Pressable
            onPress={handleChangePhotoPress}
            disabled={isPreparingPhoto || isSaving}
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            style={({ pressed }) => [
              styles.photoButton,
              pressed && styles.photoButtonPressed,
            ]}
          >
            {isPreparingPhoto ? (
              <ActivityIndicator color={COLORS.purple} />
            ) : (
              <Text style={styles.photoButtonText}>Change photo</Text>
            )}
          </Pressable>
          <Text style={styles.caption}>Cropped square and compressed</Text>
        </View>
      </View>

      <View style={styles.bioLabelRow}>
        <Text style={styles.label}>Bio</Text>
        <Text style={styles.counter}>
          {bio.length} / {MAX_BIO_LENGTH}
        </Text>
      </View>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="No bio set currently"
        placeholderTextColor={COLORS.placeholder}
        maxLength={MAX_BIO_LENGTH}
        multiline
        textAlignVertical="top"
        accessibilityLabel="Bio"
        onFocus={() => setIsBioFocused(true)}
        onBlur={() => setIsBioFocused(false)}
        style={[styles.bioInput, isBioFocused && styles.bioInputFocused]}
      />

      <ErrorText message={errorMessage} />
      <PrimaryButton
        title="Save"
        onPress={handleSavePress}
        isLoading={isSaving}
        isDisabled={(!newPhoto && !hasBioChanged) || isPreparingPhoto}
        style={styles.saveButton}
      />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_SIZE / 2,
  },
  photoActions: { marginLeft: 16, flexShrink: 1 },
  photoButton: {
    alignSelf: "flex-start",
    minWidth: 140,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonPressed: { backgroundColor: COLORS.inputBackground },
  photoButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.ink,
  },
  caption: {
    marginTop: 6,
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
  bioLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
  },
  counter: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.grey,
  },
  bioInput: {
    minHeight: 96,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  bioInputFocused: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
  saveButton: { marginTop: 20 },
});
