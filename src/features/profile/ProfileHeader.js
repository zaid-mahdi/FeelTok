// The top of the Profile tab, from the profile mockup: share and ☰ buttons
// around @username, the avatar with name and mood, the bio, the 3 numbers,
// Edit profile and Invite friends, then the "My posts" title and type chips.
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import PostTypeFilter from "../posts/PostTypeFilter";
import Avatar from "./Avatar";
import MoodPill from "./MoodPill";
import ProfileStats from "./ProfileStats";

// Shows a round light button with an icon. Takes the icon, a label for
// screen readers and an optional function to call when pressed.
function RoundIconButton({ icon, accessibilityLabel, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
    >
      <Image source={icon} style={styles.roundButtonIcon} />
    </Pressable>
  );
}

// Takes the profile, the numbers ({ postCount, reactionCount }; friends come
// with the friends tasks), the picked post type (null for All), and functions
// for picking a post type, opening Edit profile and opening Account settings.
export default function ProfileHeader({
  profile,
  stats,
  selectedPostType,
  onSelectPostType,
  onEditProfilePress,
  onSettingsPress,
}) {
  const insets = useSafeAreaInsets();
  const postCountText =
    stats.postCount === null
      ? ""
      : `${stats.postCount} ${stats.postCount === 1 ? "post" : "posts"}`;

  return (
    <View>
      <View style={[styles.profileSection, { paddingTop: insets.top + 12 }]}>
        <View style={styles.topBar}>
          {/* Share is only for the look (team decision): it does nothing. */}
          <RoundIconButton
            icon={require("../../../assets/images/icon-share-dark.svg")}
            accessibilityLabel="Share profile"
          />
          <Text style={styles.topUsername} numberOfLines={1}>
            @{profile.username}
          </Text>
          <RoundIconButton
            icon={require("../../../assets/images/icon-menu.svg")}
            accessibilityLabel="Account settings"
            onPress={onSettingsPress}
          />
        </View>

        <View style={styles.identityRow}>
          <Avatar
            name={profile.username}
            uid={profile.uid}
            hasPhoto={profile.hasPhoto}
            moodKey={profile.mood}
            size={84}
            hasBadge
          />
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.displayName}
            </Text>
            <MoodPill
              moodKey={profile.mood}
              onPress={() => router.navigate("/mood")}
            />
          </View>
        </View>

        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

        <View style={styles.stats}>
          <ProfileStats
            postCount={stats.postCount}
            friendCount={0}
            reactionCount={stats.reactionCount}
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={onEditProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            style={({ pressed }) => [
              styles.button,
              styles.editButton,
              pressed && styles.editButtonPressed,
            ]}
          >
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
          <Pressable
            onPress={() => router.navigate("/friends")}
            accessibilityRole="button"
            accessibilityLabel="Invite friends"
            style={({ pressed }) => [
              styles.button,
              styles.inviteButton,
              pressed && styles.inviteButtonPressed,
            ]}
          >
            <Text style={styles.inviteButtonText}>Invite friends</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.postsSection}>
        <View style={styles.postsTitleRow}>
          <Text style={styles.postsTitle}>My posts</Text>
          <Text style={styles.postsCount}>{postCountText}</Text>
        </View>
        <PostTypeFilter
          selectedPostType={selectedPostType}
          onSelectPostType={onSelectPostType}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.inputBackground,
  },
  roundButtonPressed: { backgroundColor: COLORS.border },
  roundButtonIcon: { width: 20, height: 20 },
  topUsername: {
    flexShrink: 1,
    marginHorizontal: 12,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey,
  },
  identityRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  identityText: { flex: 1, marginLeft: 16, gap: 8 },
  name: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.ink,
  },
  bio: {
    marginTop: 16,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
  },
  stats: { marginTop: 16 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: { backgroundColor: COLORS.purple },
  editButtonPressed: { backgroundColor: COLORS.purpleDeep },
  editButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.white,
  },
  inviteButton: {
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    backgroundColor: COLORS.white,
  },
  inviteButtonPressed: { backgroundColor: COLORS.lightPink },
  inviteButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.pinkDeep,
  },
  postsSection: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  postsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  postsTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.ink,
  },
  postsCount: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
});
