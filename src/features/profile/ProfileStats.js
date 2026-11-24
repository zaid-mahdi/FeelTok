// The 3 number boxes on Profile, from the profile mockup: posts, friends and
// reactions.
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows one box: the number ("–" while unknown) and its name.
function StatBox({ value, label, backgroundColor }) {
  return (
    <View style={[styles.box, { backgroundColor }]}>
      <Text style={styles.value}>{value ?? "–"}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

// Takes the number of posts, friends and reactions (each a number, or null
// while loading).
export default function ProfileStats({ postCount, friendCount, reactionCount }) {
  return (
    <View style={styles.row}>
      <StatBox value={postCount} label="posts" backgroundColor={COLORS.lightPurple} />
      <StatBox value={friendCount} label="friends" backgroundColor={COLORS.lightPink} />
      <StatBox
        value={reactionCount}
        label="reactions"
        backgroundColor={COLORS.inputBackground}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  box: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 14,
  },
  value: {
    fontFamily: FONTS.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.ink,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
});
