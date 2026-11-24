// The counts under a post: the most used reactions (moods) with the total,
// and the number of comments.
import { StyleSheet, Text, View } from "react-native";
import { USER_MOODS } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

const SHOWN_REACTIONS = 3;

// Takes the post's reaction counts (one number per mood) and returns the
// total and the moods with reactions, most used first, at most 3.
function summariseReactions(reactionCounts = {}) {
  const used = USER_MOODS.map((mood) => ({
    mood,
    count: reactionCounts[mood.key] ?? 0,
  }))
    .filter((reaction) => reaction.count > 0)
    .sort((first, second) => second.count - first.count);
  const total = used.reduce((sum, reaction) => sum + reaction.count, 0);
  return { total, topMoods: used.slice(0, SHOWN_REACTIONS).map((r) => r.mood) };
}

// Takes the reaction counts and the comment count, and shows the top
// reaction emojis with the total on the left, and "N comments" on the right.
export default function PostStats({ reactionCounts, commentCount = 0 }) {
  const { total, topMoods } = summariseReactions(reactionCounts);

  return (
    <View style={styles.row}>
      <View style={styles.reactions}>
        {topMoods.map((mood, index) => (
          <View
            key={mood.key}
            style={[
              styles.emojiCircle,
              { backgroundColor: mood.tintColor, zIndex: SHOWN_REACTIONS - index },
              index > 0 && styles.emojiCircleOverlap,
            ]}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </View>
        ))}
        {total > 0 && <Text style={styles.count}>{total}</Text>}
      </View>
      <Text style={styles.count}>
        {commentCount === 1 ? "1 comment" : `${commentCount} comments`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  reactions: { flexDirection: "row", alignItems: "center" },
  emojiCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCircleOverlap: { marginLeft: -6 },
  emoji: { fontSize: 11 },
  count: {
    marginLeft: 6,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
});
