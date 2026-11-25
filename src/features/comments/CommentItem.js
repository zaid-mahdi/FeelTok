// One comment, from the comment mockup: the avatar with the commenter's
// current mood, then a light bubble with their name, the time and the text.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatPostTime } from "../../utils/time";
import Avatar from "../profile/Avatar";
import { openUserProfile } from "../profile/openUserProfile";

// Takes the comment, the commenter's profile (for their current mood and
// photo; null if it couldn't be read), and onDeletePress: when given, a small
// "Delete" link is shown (only on the user's own comments).
export default function CommentItem({ comment, authorProfile, onDeletePress }) {
  return (
    <View style={styles.row}>
      {/* The avatar and the name open the commenter's profile. */}
      <Pressable
        onPress={() => openUserProfile(comment.authorId)}
        accessibilityRole="link"
        accessibilityLabel={`Open @${comment.authorUsername}'s profile`}
      >
        <Avatar
          name={comment.authorUsername}
          uid={comment.authorId}
          hasPhoto={authorProfile?.hasPhoto ?? false}
          moodKey={authorProfile?.mood ?? null}
          size={40}
          hasBadge
        />
      </Pressable>
      <View style={styles.bubble}>
        <Text style={styles.meta}>
          <Text
            style={styles.username}
            onPress={() => openUserProfile(comment.authorId)}
          >
            {comment.authorUsername}
          </Text>
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
