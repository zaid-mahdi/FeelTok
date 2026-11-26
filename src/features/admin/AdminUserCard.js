// The top card of the admin user page, from its mockup: avatar, @username,
// status, name and joined date, mood, bio, user ID, and Block / Unblock.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import Avatar from "../profile/Avatar";
import AdminMoodTag from "./AdminMoodTag";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatJoinedDate } from "./UserTable";

// Takes the user's ID and profile, canBlock (false for admins) and a
// function for the Block / Unblock button.
export default function AdminUserCard({ uid, profile, canBlock, onBlockPress }) {
  return (
    <View style={styles.card}>
      <Avatar name={profile.username} uid={uid} hasPhoto={profile.hasPhoto} moodKey={profile.mood} size={64} />
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.username}>@{profile.username}</Text>
          <AdminStatusBadge isBlocked={profile.banned} />
        </View>
        <Text style={styles.meta}>
          {profile.displayName} · Joined {formatJoinedDate(profile.createdAt)}
          {profile.role === "admin" ? " · Admin" : ""}
        </Text>
        <View style={styles.moodRow}>
          <Text style={styles.meta}>Mood: </Text>
          <AdminMoodTag moodKey={profile.mood} />
        </View>
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        <Text style={styles.uid}>User UID: {uid}</Text>
      </View>
      {canBlock && (
        <Pressable
          onPress={onBlockPress}
          accessibilityRole="button"
          accessibilityLabel={profile.banned ? "Unblock user" : "Block user"}
          style={({ hovered }) => [
            styles.blockButton,
            profile.banned && styles.unblockButton,
            hovered && styles.blockButtonHovered,
          ]}
        >
          <Text style={[styles.blockText, profile.banned && styles.unblockText]}>
            {profile.banned ? "Unblock user" : "Block user"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  details: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  username: { fontFamily: FONTS.headingBold, fontSize: 20, lineHeight: 28, color: COLORS.ink },
  meta: { fontFamily: FONTS.regular, fontSize: 13, lineHeight: 19, color: COLORS.grey },
  moodRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  bio: { marginTop: 6, fontFamily: FONTS.regular, fontSize: 13, lineHeight: 19, color: COLORS.ink },
  uid: { marginTop: 6, fontFamily: FONTS.regular, fontSize: 11, lineHeight: 16, color: COLORS.grey },
  blockButton: {
    height: 40,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  unblockButton: { borderColor: COLORS.success },
  blockButtonHovered: { backgroundColor: COLORS.inputBackground },
  blockText: { fontFamily: FONTS.semiBold, fontSize: 14, lineHeight: 20, color: COLORS.error },
  unblockText: { color: COLORS.success },
});
