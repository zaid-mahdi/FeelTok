// A small tinted mood tag for the admin tables, from the admin mockups:
// the mood's emoji and name ("😊 happy").
import { StyleSheet, Text } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes a mood key (or null). Shows "no mood" in grey when there is none.
export default function AdminMoodTag({ moodKey }) {
  const mood = findMood(moodKey);
  return (
    <Text
      style={[styles.tag, { backgroundColor: mood ? mood.tintColor : COLORS.inputBackground }, !mood && styles.noMood]}
    >
      {mood ? `${mood.emoji} ${mood.key}` : "no mood"}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.ink,
  },
  noMood: { color: COLORS.grey },
});
