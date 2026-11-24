// The grid of the 6 user moods on the Mood tab, from the Mood mockup: 3 cards
// per row, each with the mood's emoji and name.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { USER_MOODS } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import MoodEmojiCircle from "./MoodEmojiCircle";

// Takes the selected mood key (or null) and a function called with the mood
// key the user taps. The selected card gets the mood's tint and border.
export default function MoodPicker({ selectedMoodKey, onMoodPress }) {
  return (
    <View style={styles.grid} role="radiogroup">
      {USER_MOODS.map((mood) => {
        const isSelected = mood.key === selectedMoodKey;
        return (
          <Pressable
            key={mood.key}
            onPress={() => onMoodPress(mood.key)}
            role="radio"
            aria-checked={isSelected}
            accessibilityLabel={mood.label}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
              isSelected && {
                backgroundColor: mood.tintColor,
                borderColor: mood.ringColor,
              },
            ]}
          >
            <MoodEmojiCircle mood={mood} size={42} />
            <Text style={styles.label}>{mood.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    // 3 cards per row, with the 2 gaps of 10 px shared between them.
    width: "31%",
    flexGrow: 1,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: COLORS.white,
  },
  cardPressed: { opacity: 0.8 },
  label: {
    marginTop: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.ink,
  },
});
