// A friend's current mood as a small tinted tag, from the Friends mockup:
// "feeling love · 10m", or a grey "No mood set". Used on the friend list and
// in the chat header.
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatShortTimeAgo } from "../../utils/time";

// Takes the friend's profile and returns the tag text, or null when they
// have no mood.
function getMoodText(profile) {
  const mood = findMood(profile.mood);
  if (!mood) return null;
  if (!profile.moodUpdatedAt) return `feeling ${mood.key}`;
  return `feeling ${mood.key} · ${formatShortTimeAgo(profile.moodUpdatedAt)}`;
}

// Takes the friend's profile and shows the tag in their mood's tint.
export default function FriendMoodTag({ profile }) {
  const mood = findMood(profile.mood);
  const moodText = getMoodText(profile);

  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: mood ? mood.tintColor : COLORS.inputBackground },
      ]}
    >
      <Text style={[styles.text, !mood && styles.noMoodText]} numberOfLines={1}>
        {moodText ?? "No mood set"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    marginTop: 4,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.ink,
  },
  noMoodText: { color: COLORS.grey },
});
