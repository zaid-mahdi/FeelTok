// One post in the feed, from the For You feed mockup: the author, the post
// type, the text, the photo, the counts, and the React, Comment and Share
// buttons. Your own posts also have the "•••" menu with "Delete post".
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ErrorText from "../../components/ErrorText";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { confirmAction } from "../../utils/confirm";
import { friendlyError } from "../../utils/errors";
import { formatPostTime } from "../../utils/time";
import { useAuth } from "../auth/AuthContext";
import Avatar from "../profile/Avatar";
import ReactionButton from "../reactions/ReactionButton";
import { applyReactionChange } from "../reactions/reactionCounts";
import { setReaction } from "../reactions/reactionService";
import PostMenu from "./PostMenu";
import PostPhoto from "./PostPhoto";
import PostStats from "./PostStats";
import PostTypeTag from "./PostTypeTag";
import { deletePost } from "./postService";

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
// user's reaction or null) and shows it as a card. Optional: isFullText shows
// the whole text (the post page), commentCount replaces the post's count, and
// onCommentPress replaces opening the post page (the post page uses it to put
// the cursor in the comment box), and onDeleted is called after the user
// deletes their own post.
export default function PostCard({
  post,
  isFullText = false,
  commentCount = post.commentCount,
  onCommentPress,
  onDeleted,
}) {
  const { user, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwnPost = Boolean(user) && post.authorId === user.uid;
  // On your own posts the avatar follows your live profile, so a new photo
  // shows at once.
  const authorHasPhoto =
    isOwnPost && profile ? profile.hasPhoto : post.authorHasPhoto;
  const mood = findMood(post.authorMood);
  const isShortened = !isFullText && !isExpanded && isLongText(post.text);

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
    setActionErrorMessage(null);
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
      setActionErrorMessage(friendlyError(error));
    }
  }

  // Asks first, then deletes the post with its photo, comments and
  // reactions, and tells the page it is gone.
  async function handleDeletePress() {
    const isConfirmed = await confirmAction(
      "Delete this post?",
      "Its photo, comments and reactions will be deleted too. This can't be undone.",
      "Delete",
    );
    if (!isConfirmed) return;
    setActionErrorMessage(null);
    setIsDeleting(true);
    try {
      await deletePost(post);
      onDeleted?.(post.id);
    } catch (error) {
      setActionErrorMessage(friendlyError(error));
      setIsDeleting(false);
    }
  }

  // Opens the post page with its comments, unless the page gave its own
  // function.
  function handleCommentPress() {
    if (onCommentPress) {
      onCommentPress();
      return;
    }
    router.push(`/post/${post.id}`);
  }

  // Logged-out users who try to react are sent to login.
  function handleLoginNeeded() {
    router.push("/login");
  }

  return (
    <View style={[styles.card, isDeleting && styles.cardDeleting]}>
      <View style={styles.header}>
        <Avatar
          name={post.authorUsername}
          uid={post.authorId}
          hasPhoto={authorHasPhoto}
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
        {isOwnPost && !isDeleting && <PostMenu onDeletePress={handleDeletePress} />}
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
        commentCount={commentCount}
        onCommentsPress={handleCommentPress}
      />

      <View style={styles.actions}>
        <ReactionButton
          myReaction={shown.myReaction}
          onReact={handleReact}
          canReact={Boolean(user)}
          onLoginNeeded={handleLoginNeeded}
        />
        <Pressable
          onPress={handleCommentPress}
          accessibilityRole="button"
          accessibilityLabel="Comment"
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
        >
          <Image
            source={require("../../../assets/images/icon-comment.svg")}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
        {/* Share is only the look from the mockup: it does nothing yet
            (team decision). */}
        <View style={styles.action}>
          <Image
            source={require("../../../assets/images/icon-share.svg")}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Share</Text>
        </View>
      </View>
      {actionErrorMessage && (
        <View style={styles.actionError}>
          <ErrorText message={actionErrorMessage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingTop: 18, backgroundColor: COLORS.white },
  cardDeleting: { opacity: 0.4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
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
  action: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  actionPressed: { backgroundColor: COLORS.inputBackground },
  actionError: { paddingHorizontal: 20, paddingBottom: 12 },
  actionIcon: { width: 18, height: 18, marginRight: 7 },
  actionText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
});
