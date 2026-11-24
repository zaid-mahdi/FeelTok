// The user's current mood as plain text ("😊 Happy" or "No mood set"). Plain
// until the designer sends the Profile and Mood mockups.
import { Pressable, StyleSheet, Text } from "react-native";
import { findMood } from "../../constants/moods";

// Takes the mood key (or null) and an optional onPress. Shows "Current mood:"
// with the mood's emoji and name, or "No mood set".
export default function CurrentMood({ moodKey, onPress }) {
  const mood = findMood(moodKey);
  const moodText = mood ? `${mood.emoji} ${mood.label}` : "No mood set";
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`Current mood: ${mood ? mood.label : "No mood set"}`}
      style={styles.row}
    >
      <Text>Current mood: {moodText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 8 },
});
