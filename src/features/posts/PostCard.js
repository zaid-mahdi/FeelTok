// One post in the feed, from the For You feed mockup: the author, the post
// type, the text, the photo, the counts, and the React and Share buttons.
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { formatPostTime } from "../../utils/time";
import { useAuth } from "../auth/AuthContext";
import Avatar from "../profile/Avatar";
import ReactionButton from "../reactions/ReactionButton";
import { applyReactionChange } from "../reactions/reactionCounts";
import { setReaction } from "../reactions/reactionService";
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

// Takes a post from Firestore (with its id, and myReaction: the logged-in
// user's reaction or null) and shows it as a card.
export default function PostCard({ post }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactionErrorMessage, setReactionErrorMessage] = useState(null);
  const mood = findMood(post.authorMood);
  const isShortened = !isExpanded && isLongText(post.text);

  // The reaction and counts shown on screen. They change as soon as the user
  // taps, before Firestore answers, and start again from the post whenever
  // the feed loads it again.
  const [shownReaction, setShownReaction] = useState({
    post,
    myReaction: post.myReaction ?? null,
    reactionCounts: post.reactionCounts,
  });
  let shown = shownReaction;
  if (shownReaction.post !== post) {
    shown = {
      post,
      myReaction: post.myReaction ?? null,
      reactionCounts: post.reactionCounts,
    };
    setShownReaction(shown);
  }

  // Shows the whole text.
  function handleSeeMorePress() {
    setIsExpanded(true);
  }

  // Shows the new reaction straight away, then saves it. If saving fails,
  // puts the old reaction and counts back and shows the error.
  async function handleReact(newMoodKey) {
    const before = shown;
    setReactionErrorMessage(null);
    setShownReaction({
      post,
      myReaction: newMoodKey,
      reactionCounts: applyReactionChange(
        before.reactionCounts,
        before.myReaction,
        newMoodKey,
      ),
    });
    try {
      await setReaction(post.id, user.uid, newMoodKey);
    } catch (error) {
      setShownReaction(before);
      setReactionErrorMessage(friendlyError(error));
    }
  }

  // Logged-out users who try to react are sent to login.
  function handleLoginNeeded() {
    router.push("/login");
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
        reactionCounts={shown.reactionCounts}
        commentCount={post.commentCount}
      />

      <View style={styles.actions}>
        <ReactionButton
          myReaction={shown.myReaction}
          onReact={handleReact}
          canReact={Boolean(user)}
          onLoginNeeded={handleLoginNeeded}
        />
        {/* Share is only the look from the mockup: it does nothing yet
            (team decision). Comment comes in Task 9. */}
        <View style={styles.share}>
          <Image
            source={require("../../../assets/images/icon-share.svg")}
            style={styles.shareIcon}
          />
          <Text style={styles.shareText}>Share</Text>
        </View>
      </View>
      {reactionErrorMessage && (
        <View style={styles.reactionError}>
          <ErrorText message={reactionErrorMessage} />
        </View>
      )}
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
    height: 56,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  share: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reactionError: { paddingHorizontal: 20, paddingBottom: 12 },
  shareIcon: { width: 18, height: 18, marginRight: 7 },
  shareText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
});
