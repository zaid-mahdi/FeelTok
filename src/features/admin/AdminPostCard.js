// One of a user's posts on the admin user page, from its mockup: the post
// type, the mood when posting, the date, the text, Delete post, and the
// comments, each with Delete.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import PostTypeTag from "../posts/PostTypeTag";
import { formatJoinedDate } from "./UserTable";

// Takes a post and returns its meta line: the mood when posting, the date
// and whether it has a photo, like "· felt happy 😊 · 23 Nov 2026".
function getPostMeta(post) {
  const mood = findMood(post.authorMood);
  const moodText = mood ? `· felt ${mood.key} ${mood.emoji} ` : "";
  const photoText = post.imageId ? " · has a photo" : "";
  return `${moodText}· ${formatJoinedDate(post.createdAt)}${photoText}`;
}

// Takes the post (with its comments) and functions for deleting the post or
// one comment (called with the comment).
export default function AdminPostCard({ post, onDeletePostPress, onDeleteCommentPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.meta}>
          <PostTypeTag postTypeKey={post.postType} />
          <Text style={styles.metaText}>{getPostMeta(post)}</Text>
        </View>
        <Pressable
          onPress={onDeletePostPress}
          accessibilityRole="button"
          accessibilityLabel="Delete post"
          style={({ hovered }) => [styles.outlineButton, hovered && styles.outlineButtonHovered]}
        >
          <Text style={styles.outlineText}>Delete post</Text>
        </Pressable>
      </View>
      <Text style={styles.text}>{post.text}</Text>

      <View style={styles.comments}>
        <Text style={styles.commentsTitle}>Comments ({post.comments.length})</Text>
        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.commentBody}>
              <Text style={styles.commentMeta}>
                @{comment.authorUsername} · {formatJoinedDate(comment.createdAt)}
              </Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
            <Text
              style={styles.deleteLink}
              onPress={() => onDeleteCommentPress(comment)}
              accessibilityRole="button"
              accessibilityLabel={`Delete comment by @${comment.authorUsername}`}
            >
              Delete
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  metaText: { fontFamily: FONTS.regular, fontSize: 12, lineHeight: 16, color: COLORS.grey },
  outlineButton: {
    height: 34,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  outlineButtonHovered: { backgroundColor: COLORS.lightPink },
  outlineText: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.error },
  text: { marginTop: 12, fontFamily: FONTS.regular, fontSize: 14, lineHeight: 21, color: COLORS.ink },
  comments: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  commentsTitle: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.ink },
  comment: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  commentBody: { flex: 1 },
  commentMeta: { fontFamily: FONTS.regular, fontSize: 11, lineHeight: 16, color: COLORS.grey },
  commentText: { fontFamily: FONTS.regular, fontSize: 13, lineHeight: 19, color: COLORS.ink },
  deleteLink: { paddingHorizontal: 12, fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.error },
});
