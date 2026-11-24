// One post in the feed, from the For You feed mockup: the author, the post
// type, the text, the photo, the counts and the Share button.
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatPostTime } from "../../utils/time";
import Avatar from "../profile/Avatar";
import PostPhoto from "./PostPhoto";
import PostStats from "./PostStats";
import PostTypeTag from "./PostTypeTag";

// Long posts show only their first lines until "see more" is tapped.
const COLLAPSED_LINES = 4;
const LONG_POST_CHARACTERS = 180;

// Takes a post's text and returns true if it is long enough to be shortened.
function isLongText(text) {
  return (
    text.length > LONG_POST_CHARACTERS ||
    text.split("\n").length > COLLAPSED_LINES
  );
}

// Takes a post from Firestore (with its id) and shows it as a card.
export default function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mood = findMood(post.authorMood);
  const isShortened = !isExpanded && isLongText(post.text);

  // Shows the whole text.
  function handleSeeMorePress() {
    setIsExpanded(true);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar
          name={post.authorUsername}
          moodKey={post.authorMood}
          size={50}
          hasBadge
        />
        <View style={styles.headerText}>
          <Text style={styles.username} numberOfLines={1}>
            @{post.authorUsername}
          </Text>
          {mood && <Text style={styles.meta}>feeling {mood.key}</Text>}
          <Text style={styles.meta}>{formatPostTime(post.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <PostTypeTag postTypeKey={post.postType} />
        <Text
          style={styles.text}
          numberOfLines={isShortened ? COLLAPSED_LINES : undefined}
        >
          {post.text}
        </Text>
        {isShortened && (
          <Text
            style={styles.seeMore}
            onPress={handleSeeMorePress}
            accessibilityRole="button"
          >
            ...see more
          </Text>
        )}
      </View>

      {post.imageId && <PostPhoto postId={post.imageId} />}

      <PostStats
        reactionCounts={post.reactionCounts}
        commentCount={post.commentCount}
      />

      <View style={styles.actions}>
        {/* Share is only the look from the mockup: it does nothing yet
            (team decision). React and Comment come in Tasks 8 and 9. */}
        <View style={styles.share}>
          <Image
            source={require("../../../assets/images/icon-share.svg")}
            style={styles.shareIcon}
          />
          <Text style={styles.shareText}>Share</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingTop: 18, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: { flex: 1, marginLeft: 12 },
  username: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.ink,
  },
  meta: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.grey,
  },
  body: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  text: {
    marginTop: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.ink,
  },
  seeMore: {
    alignSelf: "flex-end",
    marginTop: 4,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  actions: {
    height: 50,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  share: { flexDirection: "row", alignItems: "center" },
  shareIcon: { width: 18, height: 18, marginRight: 7 },
  shareText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
});
