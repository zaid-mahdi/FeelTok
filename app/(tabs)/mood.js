// Mood tab: shows my current mood, and lets me pick a new one from the 6 user
// moods. Plain until the designer sends the Mood mockup.
import { Redirect } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";
import CurrentMood from "../../src/features/profile/CurrentMood";
import MoodPicker from "../../src/features/profile/MoodPicker";
import { saveMood } from "../../src/features/profile/profileService";
import { friendlyError } from "../../src/utils/errors";

// Shows the current mood. Tapping it opens the list of moods; picking one
// saves it as the new current mood. Logged-out users are sent to login.
export default function MoodScreen() {
  const { user, profile, profileError } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Saves the picked mood (unless it is already the current one) and closes
  // the list.
  async function handleMoodPress(moodKey) {
    setErrorMessage(null);
    if (moodKey === profile.mood) {
      setIsPickerOpen(false);
      return;
    }
    setIsSaving(true);
    try {
      await saveMood(user.uid, moodKey);
      setIsPickerOpen(false);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) return <Redirect href="/login" />;
  if (profileError) return <ErrorText message={friendlyError(profileError)} />;
  if (!profile) return <LoadingSpinner />;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text>Mood (design coming soon)</Text>
      <CurrentMood
        moodKey={profile.mood}
        onPress={() => setIsPickerOpen((isOpen) => !isOpen)}
      />
      {isPickerOpen && (
        <>
          <Text>How are you feeling?</Text>
          <MoodPicker
            selectedMoodKey={profile.mood}
            onMoodPress={handleMoodPress}
            isDisabled={isSaving}
          />
        </>
      )}
      <ErrorText message={errorMessage} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 8 },
});
