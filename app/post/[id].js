// Post page: one post with its comments, opened by Comment or "N comments" on
// a post card. Anyone can read it; logged-in users can comment.
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../../src/components/BackButton";
import ConfirmDialog from "../../src/components/ConfirmDialog";
import EmptyState from "../../src/components/EmptyState";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";
import CommentInput from "../../src/features/comments/CommentInput";
import CommentItem from "../../src/features/comments/CommentItem";
import useComments from "../../src/features/comments/useComments";
import PostCard from "../../src/features/posts/card/PostCard";
import usePost from "../../src/features/posts/usePost";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";
import { friendlyError } from "../../src/utils/errors";

// Goes back to the page before, or to Home when the post was opened directly.
function handleBackPress() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

// Shows the header, the post, the comment box and the comments.
export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { post, isLoading: isPostLoading, errorMessage: postError } = usePost(id);
  const comments = useComments(id);
  const [actionError, setActionError] = useState(null);
  // The comment in the "Delete this comment?" pop-up (null when it is closed).
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const commentInputRef = useRef(null);

  // Saves the comment. Returns true when it was saved, so the box empties.
  async function handleSendComment(text) {
    setActionError(null);
    try {
      await comments.add(profile, text);
      return true;
    } catch (error) {
      setActionError(friendlyError(error));
      return false;
    }
  }

  // Deletes the comment in the pop-up, then closes it. If it fails, the
  // pop-up closes and the error shows under the comment box.
  async function handleConfirmDeleteComment() {
    setIsDeletingComment(true);
    setActionError(null);
    try {
      await comments.remove(commentIdToDelete);
    } catch (error) {
      setActionError(friendlyError(error));
    } finally {
      setIsDeletingComment(false);
      setCommentIdToDelete(null);
    }
  }

  // Comment on the post card puts the cursor in the comment box, or sends
  // logged-out users to login.
  function handleCommentPress() {
    if (!user) router.push("/login");
    else commentInputRef.current?.focus();
  }

  let content;
  if (isPostLoading) {
    content = <LoadingSpinner />;
  } else if (postError) {
    content = <EmptyState message={postError} />;
  } else if (!post) {
    content = <EmptyState message="This post doesn't exist anymore." />;
  } else {
    content = (
      <FlatList
        data={comments.comments}
        keyExtractor={(comment) => comment.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <PostCard
              post={post}
              isFullText
              commentCount={
                comments.isLoading ? post.commentCount : comments.comments.length
              }
              onCommentPress={handleCommentPress}
              onDeleted={handleBackPress}
            />
            <View style={styles.commentBox}>
              {user && profile ? (
                <CommentInput
                  onSend={handleSendComment}
                  inputRef={commentInputRef}
                />
              ) : (
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push("/login")}
                  accessibilityRole="link"
                >
                  Log in to comment
                </Text>
              )}
              <ErrorText message={actionError ?? comments.errorMessage} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <CommentItem
              comment={item}
              authorProfile={comments.profilesById[item.authorId] ?? null}
              onDeletePress={
                user && item.authorId === user.uid
                  ? () => setCommentIdToDelete(item.id)
                  : undefined
              }
            />
          </View>
        )}
        ListEmptyComponent={
          comments.isLoading ? (
            <LoadingSpinner />
          ) : (
            <Text style={styles.empty}>No comments yet</Text>
          )
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        style={styles.list}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.backButton}>
          <BackButton onPress={handleBackPress} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Post
        </Text>
      </View>
      {content}
      <ConfirmDialog
        isVisible={commentIdToDelete !== null}
        emoji="🗑️"
        title="Delete this comment?"
        message="This can't be undone."
        confirmText="Delete"
        isConfirming={isDeletingComment}
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setCommentIdToDelete(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  header: {
    paddingBottom: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    boxShadow: "0 4px 12px rgba(20, 18, 42, 0.05)",
    zIndex: 1,
  },
  backButton: { position: "absolute", left: 16, bottom: 8 },
  title: {
    height: 44,
    fontFamily: FONTS.headingBold,
    fontSize: 20,
    lineHeight: 44,
    color: COLORS.ink,
  },
  list: { flex: 1, backgroundColor: COLORS.white },
  commentBox: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  loginLink: {
    paddingVertical: 12,
    textAlign: "center",
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.purple,
  },
  comment: { paddingHorizontal: 16, paddingBottom: 14 },
  empty: {
    paddingVertical: 24,
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
});
