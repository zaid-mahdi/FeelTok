// Mood tab, from the Mood mockup: my current mood, the 6 moods to pick from,
// and a button that saves the picked one as my new current mood.
import { Redirect } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useAuth } from "../../src/features/auth/AuthContext";
import CurrentMood from "../../src/features/profile/CurrentMood";
import MoodPicker from "../../src/features/profile/MoodPicker";
import { saveMood } from "../../src/features/profile/profileService";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";
import { friendlyError } from "../../src/utils/errors";

// Returns the bottom button's text: what tapping it will do, or why it can't
// be tapped.
function getButtonTitle(pickedMoodKey, currentMoodKey) {
  if (pickedMoodKey && pickedMoodKey !== currentMoodKey) return "Set as my mood";
  if (currentMoodKey) return "This is your current mood";
  return "Pick a mood";
}

// Shows the Mood tab. Tapping a mood only picks it; the button saves it.
// Logged-out users are sent to login.
export default function MoodScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, profileError } = useAuth();
  // The mood the user tapped and hasn't saved yet (null: none picked, so the
  // current mood is shown as selected).
  const [pickedMoodKey, setPickedMoodKey] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Saves the picked mood as the new current mood.
  async function handleSavePress() {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await saveMood(user.uid, pickedMoodKey);
      setPickedMoodKey(null);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsSaving(false);
    }
  }

  // Picks a mood without saving it, and clears an old error.
  function handleMoodPress(moodKey) {
    setPickedMoodKey(moodKey);
    setErrorMessage(null);
  }

  if (!user) return <Redirect href="/login" />;
  if (profileError) return <ErrorText message={friendlyError(profileError)} />;
  if (!profile) return <LoadingSpinner />;

  const currentMoodKey = profile.mood ?? null;
  const selectedMoodKey = pickedMoodKey ?? currentMoodKey;
  const hasNewMood = pickedMoodKey !== null && pickedMoodKey !== currentMoodKey;

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>My mood</Text>
        <Text style={styles.subtitle}>
          Your friends see this on your profile and in their friend list.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <CurrentMood moodKey={currentMoodKey} updatedAt={profile.moodUpdatedAt} />
        <Text style={styles.question}>How are you feeling?</Text>
        <MoodPicker
          selectedMoodKey={selectedMoodKey}
          onMoodPress={handleMoodPress}
        />
      </ScrollView>

      <View style={styles.footer}>
        <ErrorText message={errorMessage} />
        <PrimaryButton
          title={getButtonTitle(pickedMoodKey, currentMoodKey)}
          onPress={handleSavePress}
          isLoading={isSaving}
          isDisabled={!hasNewMood}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: COLORS.ink,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  content: { padding: 16, paddingTop: 16 },
  question: {
    marginTop: 24,
    marginBottom: 12,
    fontFamily: FONTS.headingBold,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.ink,
  },
  footer: { paddingHorizontal: 16, paddingBottom: 16 },
  button: { marginTop: 8 },
});
