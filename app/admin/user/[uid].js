// Admin user page (/admin/user/[uid], Task 17), from its mockup: one user's
// details with Block / Unblock, and all their posts with their comments.
// The admin can delete any post or comment, but can't edit them.
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import ConfirmDialog from "../../../src/components/ConfirmDialog";
import ErrorText from "../../../src/components/ErrorText";
import LoadingSpinner from "../../../src/components/LoadingSpinner";
import AdminOnly from "../../../src/features/admin/AdminOnly";
import AdminPostCard from "../../../src/features/admin/AdminPostCard";
import AdminShell from "../../../src/features/admin/AdminShell";
import AdminUserCard from "../../../src/features/admin/AdminUserCard";
import { fetchUserWithPosts, setUserBlocked } from "../../../src/features/admin/adminService";
import useAdminData from "../../../src/features/admin/useAdminData";
import { useAuth } from "../../../src/features/auth/AuthContext";
import { deleteComment } from "../../../src/features/comments/commentService";
import { deletePost } from "../../../src/features/posts/postService";
import { COLORS } from "../../../src/theme/colors";
import { FONTS } from "../../../src/theme/fonts";
import { friendlyError } from "../../../src/utils/errors";

// Returns the texts of the confirm pop-up for an action: blocking a user,
// deleting a post or deleting a comment.
function getDialogTexts(action, username) {
  if (action.type === "block") {
    return {
      emoji: "🚫",
      title: `Block @${username}?`,
      message: "They will be logged out and can't log in until you unblock them. Their posts and comments stay unless you delete them.",
      confirmText: "Block",
    };
  }
  if (action.type === "post") {
    return {
      emoji: "🗑️",
      title: "Delete this post?",
      message: "Its photo, comments and reactions will be deleted too. This can't be undone.",
      confirmText: "Delete",
    };
  }
  return {
    emoji: "🗑️",
    title: `Delete @${action.comment.authorUsername}'s comment?`,
    message: "This can't be undone.",
    confirmText: "Delete",
  };
}

// Shows one user to an admin.
function UserPage() {
  const { uid } = useLocalSearchParams();
  const { user: admin } = useAuth();
  const userData = useAdminData(() => fetchUserWithPosts(uid), [uid]);
  // The action waiting in the confirm pop-up: { type: "block" },
  // { type: "post", post } or { type: "comment", post, comment }, or null.
  const [pendingAction, setPendingAction] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState(null);
  const profile = userData.data?.profile;
  const canBlock = Boolean(profile) && profile.role !== "admin" && uid !== admin?.uid;

  // Does the confirmed action, then loads the user again.
  async function runAction(action) {
    setIsWorking(true);
    setActionErrorMessage(null);
    try {
      if (action.type === "block") await setUserBlocked(uid, true);
      if (action.type === "unblock") await setUserBlocked(uid, false);
      if (action.type === "post") await deletePost(action.post);
      if (action.type === "comment") await deleteComment(action.post.id, action.comment.id);
      await userData.reload();
    } catch (error) {
      setActionErrorMessage(friendlyError(error));
    } finally {
      setIsWorking(false);
      setPendingAction(null);
    }
  }

  // Blocking asks first; unblocking happens straight away.
  function handleBlockPress() {
    if (profile.banned) runAction({ type: "unblock" });
    else setPendingAction({ type: "block" });
  }

  let content;
  if (userData.isLoading) content = <LoadingSpinner />;
  else if (userData.errorMessage) content = <ErrorText message={userData.errorMessage} />;
  else if (!profile) content = <Text style={styles.empty}>This user doesn't exist.</Text>;
  else {
    content = (
      <>
        <AdminUserCard uid={uid} profile={profile} canBlock={canBlock} onBlockPress={handleBlockPress} />
        <ErrorText message={actionErrorMessage} />
        <Text style={styles.postsTitle}>Posts ({userData.data.posts.length})</Text>
        {userData.data.posts.length === 0 && (
          <Text style={styles.empty}>@{profile.username} hasn't posted anything.</Text>
        )}
        {userData.data.posts.map((post) => (
          <AdminPostCard
            key={post.id}
            post={post}
            onDeletePostPress={() => setPendingAction({ type: "post", post })}
            onDeleteCommentPress={(comment) => setPendingAction({ type: "comment", post, comment })}
          />
        ))}
      </>
    );
  }

  const dialogTexts = pendingAction ? getDialogTexts(pendingAction, profile?.username) : {};

  return (
    <AdminShell activeItem="users" caption="FeelTok admin" title="Users">
      <Pressable
        onPress={() => router.push("/admin/users")}
        accessibilityRole="link"
        accessibilityLabel="All users"
        style={styles.backLink}
      >
        <Image source={require("../../../assets/images/icon-back-purple.svg")} style={styles.backIcon} />
        <Text style={styles.backText}>All users</Text>
      </Pressable>
      {content}
      <ConfirmDialog
        isVisible={pendingAction !== null}
        emoji={dialogTexts.emoji}
        title={dialogTexts.title}
        message={dialogTexts.message}
        confirmText={dialogTexts.confirmText}
        isConfirming={isWorking}
        onConfirm={() => runAction(pendingAction)}
        onCancel={() => setPendingAction(null)}
      />
    </AdminShell>
  );
}

// The page, for admins only.
export default function AdminUserScreen() {
  return (
    <AdminOnly>
      <UserPage />
    </AdminOnly>
  );
}

const styles = StyleSheet.create({
  backLink: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 16 },
  backIcon: { width: 16, height: 16, marginRight: 6 },
  backText: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.purple },
  postsTitle: { marginBottom: 12, fontFamily: FONTS.headingBold, fontSize: 17, lineHeight: 24, color: COLORS.ink },
  empty: { padding: 24, textAlign: "center", fontFamily: FONTS.medium, fontSize: 14, color: COLORS.grey },
});
