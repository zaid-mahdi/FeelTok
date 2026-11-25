// The current mood under the name on Profile, from the profile mockup: the
// mood's emoji in a white circle and "Feeling happy", on the mood's tint.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the mood key (or null) and an optional function called when it is
// tapped (without it the pill is read-only, as on other people's profiles).
// Shows "No mood set" when there is no mood.
export default function MoodPill({ moodKey, onPress }) {
  const mood = findMood(moodKey);
  const text = mood ? `Feeling ${mood.key}` : "No mood set";
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? `${text}. Change mood` : text}
      style={[
        styles.pill,
        { backgroundColor: mood ? mood.tintColor : COLORS.inputBackground },
      ]}
    >
      {mood && (
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
        </View>
      )}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: 15,
  },
  emojiCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  emoji: { fontSize: 13 },
  text: {
    marginLeft: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
  },
});
