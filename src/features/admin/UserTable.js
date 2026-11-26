// The Users table on the admin Users page, from its mockup: user, mood,
// posts, joined date, status and a View button.
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import Avatar from "../profile/Avatar";
import AdminMoodTag from "./AdminMoodTag";
import AdminStatusBadge from "./AdminStatusBadge";

// Takes a Firestore timestamp and returns a date like "12 Nov 2026".
export function formatJoinedDate(timestamp) {
  if (!timestamp) return "–";
  return timestamp
    .toDate()
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Takes the users to show (with uid and postCount) and the empty message.
export default function UserTable({ users, emptyMessage }) {
  return (
    <View>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerCell, styles.userColumn]}>USER</Text>
        <Text style={[styles.headerCell, styles.moodColumn]}>MOOD</Text>
        <Text style={[styles.headerCell, styles.postsColumn]}>POSTS</Text>
        <Text style={[styles.headerCell, styles.joinedColumn]}>JOINED</Text>
        <Text style={[styles.headerCell, styles.statusColumn]}>STATUS</Text>
        <Text style={[styles.headerCell, styles.actionColumn]}>ACTIONS</Text>
      </View>
      {users.length === 0 && <Text style={styles.empty}>{emptyMessage}</Text>}
      {users.map((user) => (
        <View key={user.uid} style={styles.row}>
          <View style={[styles.userColumn, styles.userCell]}>
            <Avatar name={user.username} uid={user.uid} hasPhoto={user.hasPhoto} moodKey={null} size={38} />
            <View style={styles.userText}>
              <Text style={styles.name} numberOfLines={1}>
                {user.displayName}
                {user.role === "admin" ? "  (admin)" : ""}
              </Text>
              <Text style={styles.username} numberOfLines={1}>
                @{user.username}
              </Text>
            </View>
          </View>
          <View style={styles.moodColumn}>
            <AdminMoodTag moodKey={user.mood} />
          </View>
          <Text style={[styles.cell, styles.postsColumn, styles.bold]}>{user.postCount}</Text>
          <Text style={[styles.cell, styles.joinedColumn]}>{formatJoinedDate(user.createdAt)}</Text>
          <View style={styles.statusColumn}>
            <AdminStatusBadge isBlocked={user.banned} />
          </View>
          <View style={styles.actionColumn}>
            <Pressable
              onPress={() => router.push(`/admin/user/${user.uid}`)}
              accessibilityRole="button"
              accessibilityLabel={`View @${user.username}`}
              style={({ hovered }) => [styles.viewButton, hovered && styles.viewButtonHovered]}
            >
              <Text style={styles.viewText}>View</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: { minHeight: 36 },
  headerCell: { fontFamily: FONTS.semiBold, fontSize: 11, lineHeight: 16, color: COLORS.grey },
  userColumn: { flex: 3, paddingLeft: 8 },
  moodColumn: { flex: 2 },
  postsColumn: { flex: 0.8 },
  joinedColumn: { flex: 1.3 },
  statusColumn: { flex: 1.1 },
  actionColumn: { flex: 0.9, alignItems: "flex-end", paddingRight: 8 },
  userCell: { flexDirection: "row", alignItems: "center" },
  userText: { flex: 1, marginLeft: 10 },
  name: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.ink },
  username: { fontFamily: FONTS.regular, fontSize: 12, lineHeight: 16, color: COLORS.grey },
  cell: { fontFamily: FONTS.regular, fontSize: 13, lineHeight: 18, color: COLORS.grey },
  bold: { fontFamily: FONTS.semiBold, color: COLORS.ink },
  viewButton: {
    height: 32,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  viewButtonHovered: { backgroundColor: COLORS.inputBackground },
  viewText: { fontFamily: FONTS.semiBold, fontSize: 13, lineHeight: 18, color: COLORS.ink },
  empty: {
    padding: 24,
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.grey,
  },
});
