// The top of the New post page: the author's avatar and name, and their
// current mood ("feeling happy"), which is saved with the post. The mood is
// changed only on the Mood tab (team decision 2026-11-25), so it is read-only
// here.
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import Avatar from "../profile/Avatar";

// Takes the author's name, ID, hasPhoto (for the avatar) and current mood
// key (or null). With no mood it shows "No mood set" and a link to the Mood
// tab.
export default function PostAuthorMood({ name, uid, hasPhoto, moodKey }) {
  const mood = findMood(moodKey);

  return (
    <View style={styles.row}>
      <Avatar
        name={name}
        uid={uid}
        hasPhoto={hasPhoto}
        moodKey={moodKey}
        size={48}
      />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.moodRow}>
          <View
            style={[
              styles.moodTag,
              { backgroundColor: mood ? mood.tintColor : COLORS.white },
            ]}
          >
            <Text style={styles.moodTagText}>
              {mood ? `${mood.emoji} feeling ${mood.key}` : "No mood set"}
            </Text>
          </View>
          {!mood && (
            <Text
              style={styles.setMood}
              onPress={() => router.navigate("/mood")}
              accessibilityRole="link"
            >
              Set your mood
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  details: { flex: 1, marginLeft: 12 },
  name: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.ink,
  },
  moodRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  moodTag: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    justifyContent: "center",
  },
  moodTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.ink,
  },
  setMood: {
    marginLeft: 12,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.purple,
  },
});
