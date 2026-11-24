// The React button under a post, and the row of 6 moods that opens above it
// (from the reactions mockup).
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { findMood, USER_MOODS } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the user's reaction (a mood key, or null), a function called with
// the picked mood key (or null when the user taps their reaction again to
// remove it), and canReact (false for logged-out users: then onLoginNeeded
// is called instead of opening the moods).
export default function ReactionButton({
  myReaction,
  onReact,
  canReact,
  onLoginNeeded,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const myMood = findMood(myReaction);

  // Opens or closes the row of moods, or asks logged-out users to log in.
  function handleButtonPress() {
    if (!canReact) {
      onLoginNeeded();
      return;
    }
    setIsPickerOpen((isOpen) => !isOpen);
  }

  // Picks a mood, or removes the reaction when it is the same mood again.
  function handleMoodPress(moodKey) {
    setIsPickerOpen(false);
    onReact(moodKey === myReaction ? null : moodKey);
  }

  return (
    <View style={styles.wrapper}>
      {isPickerOpen && (
        <View style={styles.picker} role="group" aria-label="Pick a reaction">
          {USER_MOODS.map((mood) => (
            <Pressable
              key={mood.key}
              onPress={() => handleMoodPress(mood.key)}
              accessibilityRole="button"
              accessibilityLabel={`React ${mood.label}`}
              aria-pressed={mood.key === myReaction}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: mood.tintColor },
                mood.key === myReaction && { borderColor: mood.ringColor },
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionEmoji}>{mood.emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleButtonPress}
        accessibilityRole="button"
        accessibilityLabel={myMood ? `Your reaction: ${myMood.label}` : "React"}
        aria-expanded={isPickerOpen}
        style={({ pressed }) => [
          styles.button,
          (isPickerOpen || pressed) && styles.buttonOpen,
        ]}
      >
        {myMood ? (
          <Text style={styles.buttonEmoji}>{myMood.emoji}</Text>
        ) : (
          <Image
            source={require("../../../assets/images/tab-mood.svg")}
            style={styles.buttonIcon}
          />
        )}
        <Text style={[styles.buttonText, myMood && styles.buttonTextReacted]}>
          {myMood ? myMood.label : "React"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  picker: {
    position: "absolute",
    bottom: 46,
    left: 2,
    flexDirection: "row",
    gap: 5,
    padding: 5,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    boxShadow: "0 6px 20px rgba(20, 18, 42, 0.16)",
    zIndex: 10,
  },
  option: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  optionPressed: { transform: [{ scale: 1.12 }] },
  optionEmoji: { fontSize: 22 },
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonOpen: { backgroundColor: COLORS.inputBackground },
  buttonIcon: { width: 18, height: 18, marginRight: 7 },
  buttonEmoji: { fontSize: 16, marginRight: 7 },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
  buttonTextReacted: { color: COLORS.ink },
});
