// The admin dashboard (Task 17), from its mockup: the total users, total
// posts and blocked users, and the newest posts to moderate, each with
// Delete.
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ConfirmDialog from "../../../components/ConfirmDialog";
import ErrorText from "../../../components/ErrorText";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { friendlyError } from "../../../utils/errors";
import { useAuth } from "../../auth/AuthContext";
import { deletePost } from "../../posts/postService";
import AdminShell from "../layout/AdminShell";
import RecentPostRow from "./RecentPostRow";
import StatCard from "./StatCard";
import { fetchAdminStats, fetchRecentPosts } from "../adminService";
import useAdminData from "../useAdminData";

// Loads the numbers and the recent posts together.
async function loadDashboard() {
  const [stats, posts] = await Promise.all([fetchAdminStats(), fetchRecentPosts()]);
  return { stats, posts };
}

// Shows the dashboard to a signed-in admin.
export default function AdminDashboard() {
  const { profile } = useAuth();
  const dashboard = useAdminData(loadDashboard);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState(null);
  const stats = dashboard.data?.stats;

  // Deletes the post in the pop-up (with its photo, comments and reactions),
  // then loads the dashboard again.
  async function handleConfirmDelete() {
    setIsDeleting(true);
    setActionErrorMessage(null);
    try {
      await deletePost(postToDelete);
      await dashboard.reload();
    } catch (error) {
      setActionErrorMessage(friendlyError(error));
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  }

  return (
    <AdminShell
      activeItem="dashboard"
      caption={`Welcome back, ${profile?.displayName ?? "admin"}`}
      title="Dashboard"
    >
      <View style={styles.stats}>
        <StatCard
          label="Total users"
          value={stats?.totalUsers ?? null}
          icon={require("../../../../assets/images/icon-stat-users.svg")}
          tintColor={COLORS.lightPurple}
        />
        <StatCard
          label="Total posts"
          value={stats?.totalPosts ?? null}
          icon={require("../../../../assets/images/icon-stat-posts.svg")}
          tintColor={COLORS.lightPink}
        />
        <StatCard
          label="Blocked users"
          value={stats?.blockedUsers ?? null}
          icon={require("../../../../assets/images/icon-stat-blocked.svg")}
          tintColor={COLORS.lightPink}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Recent posts to moderate</Text>
            <Text style={styles.cardSubtitle}>
              Newest first. Deleting a post also removes its picture, comments and reactions.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/admin/users")}
            accessibilityRole="link"
            accessibilityLabel="Manage users"
            style={({ hovered }) => [styles.manageButton, hovered && styles.manageButtonHovered]}
          >
            <Text style={styles.manageText}>Manage users</Text>
          </Pressable>
        </View>
        <ErrorText message={actionErrorMessage ?? dashboard.errorMessage} />
        {dashboard.isLoading && <LoadingSpinner />}
        {dashboard.data && dashboard.data.posts.length === 0 && (
          <Text style={styles.empty}>No posts yet.</Text>
        )}
        {dashboard.data?.posts.map((post) => (
          <RecentPostRow key={post.id} post={post} onDeletePress={() => setPostToDelete(post)} />
        ))}
      </View>

      <ConfirmDialog
        isVisible={postToDelete !== null}
        emoji="🗑️"
        title={`Delete @${postToDelete?.authorUsername}'s post?`}
        message="Its photo, comments and reactions will be deleted too. This can't be undone."
        confirmText="Delete"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: 14, marginBottom: 18 },
  card: { padding: 20, borderRadius: 20, backgroundColor: COLORS.white },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: { fontFamily: FONTS.headingBold, fontSize: 18, lineHeight: 24, color: COLORS.ink },
  cardSubtitle: { fontFamily: FONTS.regular, fontSize: 12, lineHeight: 16, color: COLORS.grey },
  manageButton: {
    height: 36,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  manageButtonHovered: { backgroundColor: COLORS.inputBackground },
  manageText: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.ink },
  empty: { padding: 24, textAlign: "center", fontFamily: FONTS.medium, fontSize: 14, color: COLORS.grey },
});
