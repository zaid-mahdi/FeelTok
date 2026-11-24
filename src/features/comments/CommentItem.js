// One comment, from the comment mockup: the avatar with the commenter's
// current mood, then a light bubble with their name, the time and the text.
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatPostTime } from "../../utils/time";
import Avatar from "../profile/Avatar";

// Takes the comment, the commenter's current mood key (or null), and
// onDeletePress: when given, a small "Delete" link is shown (only on the
// user's own comments).
export default function CommentItem({ comment, moodKey, onDeletePress }) {
  return (
    <View style={styles.row}>
      <Avatar
        name={comment.authorUsername}
        moodKey={moodKey}
        size={40}
        hasBadge
      />
      <View style={styles.bubble}>
        <Text style={styles.meta}>
          <Text style={styles.username}>{comment.authorUsername}</Text>
          {` · ${formatPostTime(comment.createdAt)}`}
          {onDeletePress && (
            <>
              {" · "}
              <Text
                style={styles.delete}
                onPress={onDeletePress}
                accessibilityRole="button"
                accessibilityLabel="Delete comment"
              >
                Delete
              </Text>
            </>
          )}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  bubble: {
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.inputBackground,
  },
  meta: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.grey,
  },
  username: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.ink },
  delete: { fontFamily: FONTS.semiBold, color: COLORS.grey },
  text: {
    marginTop: 3,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ink,
  },
});
