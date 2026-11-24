// The list of the 6 user moods to pick a current mood from. Plain until the
// designer sends the Mood mockup.
import { Button, StyleSheet, View } from "react-native";
import { USER_MOODS } from "../../constants/moods";

// Takes the selected mood key (or null), a function called with the picked
// mood key, and isDisabled (while saving). Shows one button per mood; the
// selected one says "(current)".
export default function MoodPicker({ selectedMoodKey, onMoodPress, isDisabled }) {
  return (
    <View style={styles.list}>
      {USER_MOODS.map((mood) => (
        <Button
          key={mood.key}
          title={`${mood.emoji} ${mood.label}${
            mood.key === selectedMoodKey ? " (current)" : ""
          }`}
          onPress={() => onMoodPress(mood.key)}
          disabled={isDisabled}
          accessibilityLabel={mood.label}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
});
