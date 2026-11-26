// The "Right now you're feeling" card at the top of the Mood tab, from the
// Mood mockup: the mood's emoji, its name, when it was set, and "Set to no
// mood" to clear it.
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatTimeAgo } from "../../utils/time";
import MoodEmojiCircle from "./MoodEmojiCircle";

const HALO_SIZE = 76;

// Takes the current mood key (or null), when it was set (a Firestore
// timestamp, or null), and optional onClearPress and isClearing for the "Set
// to no mood" link. Shows "No mood set" when there is no mood.
export default function CurrentMood({ moodKey, updatedAt, onClearPress, isClearing = false }) {
  const mood = findMood(moodKey);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.halo,
          { backgroundColor: mood ? mood.tintColor : COLORS.inputBackground },
        ]}
      >
        {mood ? (
          <MoodEmojiCircle mood={mood} size={60} />
        ) : (
          <Text style={styles.noMoodMark}>?</Text>
        )}
      </View>
      <View style={styles.text}>
        <Text style={styles.caption}>Right now you're feeling</Text>
        <Text style={styles.moodName}>{mood ? mood.label : "No mood set"}</Text>
        {mood && updatedAt && (
          <Text style={styles.updated}>Updated {formatTimeAgo(updatedAt)}</Text>
        )}
        {!mood && <Text style={styles.updated}>Pick a mood below</Text>}
        {mood && onClearPress && (
          <Text
            style={[styles.clearLink, isClearing && styles.clearLinkBusy]}
            onPress={isClearing ? undefined : onClearPress}
            accessibilityRole="button"
            accessibilityState={{ disabled: isClearing }}
          >
            Set to no mood
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  halo: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  noMoodMark: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 28,
    color: COLORS.grey,
  },
  text: { flex: 1, marginLeft: 16 },
  caption: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  moodName: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 28,
    lineHeight: 36,
    color: COLORS.ink,
  },
  clearLink: {
    alignSelf: "flex-start",
    marginTop: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.purple,
    textDecorationLine: "underline",
  },
  clearLinkBusy: { opacity: 0.5 },
  updated: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
});
