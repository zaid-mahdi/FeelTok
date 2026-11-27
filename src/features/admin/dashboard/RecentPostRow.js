// One post in "Recent posts to moderate" on the admin dashboard, from its
// mockup: the author, the mood when posting, the time, the text, the counts
// and Delete.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { pluralize } from "../../../utils/text";
import { formatTimeAgo } from "../../../utils/time";
import { getTotalReactions } from "../../reactions/reactionCounts";
import Avatar from "../../profile/Avatar";
import AdminDeleteButton from "../parts/AdminDeleteButton";
import AdminMoodTag from "../parts/AdminMoodTag";

// Takes the post and a function for Delete. Tapping the author opens their
// admin user page.
export default function RecentPostRow({ post, onDeletePress }) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.push(`/admin/user/${post.authorId}`)}
        accessibilityRole="link"
        accessibilityLabel={`Open @${post.authorUsername}`}
      >
        <Avatar name={post.authorUsername} uid={post.authorId} hasPhoto={post.authorHasPhoto} moodKey={null} size={44} />
      </Pressable>
      <View style={styles.body}>
        <View style={styles.meta}>
          <Text style={styles.username}>{post.authorUsername}</Text>
          {post.authorMood && <AdminMoodTag moodKey={post.authorMood} />}
          <Text style={styles.time}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
        <Text style={styles.text} numberOfLines={2}>{post.text}</Text>
      </View>
      <Text style={styles.count}>{pluralize(getTotalReactions(post.reactionCounts), "reaction")}</Text>
      <Text style={styles.count}>{pluralize(post.commentCount, "comment")}</Text>
      <AdminDeleteButton onPress={onDeletePress} accessibilityLabel={`Delete post by @${post.authorUsername}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  body: { flex: 1 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8 },
  username: { fontFamily: FONTS.headingBold, fontSize: 14, lineHeight: 20, color: COLORS.ink },
  time: { fontFamily: FONTS.regular, fontSize: 12, lineHeight: 16, color: COLORS.grey },
  text: { marginTop: 3, fontFamily: FONTS.regular, fontSize: 13, lineHeight: 19, color: COLORS.ink },
  count: { fontFamily: FONTS.medium, fontSize: 12, lineHeight: 16, color: COLORS.grey },
});
