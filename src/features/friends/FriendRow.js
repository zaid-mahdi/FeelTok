// One friend in the friend list, from the Friends mockup: avatar with mood
// ring and emoji, @username, their current mood with how long ago they set
// it ("feeling love · 10m"), and the ⋮ menu.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatShortTimeAgo } from "../../utils/time";
import Avatar from "../profile/Avatar";
import FriendMenu from "./FriendMenu";

// Takes the friend's profile and returns the mood tag text, or null when
// they have no mood.
function getMoodText(profile) {
  const mood = findMood(profile.mood);
  if (!mood) return null;
  if (!profile.moodUpdatedAt) return `feeling ${mood.key}`;
  return `feeling ${mood.key} · ${formatShortTimeAgo(profile.moodUpdatedAt)}`;
}

// Takes the friend ({ uid, profile }), isMenuOpen, and functions to open the
// profile, open or close the menu, and remove the friend. Tapping the row
// opens their profile.
export default function FriendRow({
  friend,
  isMenuOpen,
  onOpenProfile,
  onMenuToggle,
  onRemovePress,
}) {
  const { profile } = friend;
  const mood = findMood(profile.mood);
  const moodText = getMoodText(profile);

  return (
    <View style={[styles.row, isMenuOpen && styles.rowWithMenu]}>
      <Pressable
        onPress={onOpenProfile}
        accessibilityRole="link"
        accessibilityLabel={`Open @${profile.username}'s profile`}
        style={styles.details}
      >
        <Avatar
          name={profile.username}
          uid={friend.uid}
          hasPhoto={profile.hasPhoto}
          moodKey={profile.mood}
          size={52}
          hasBadge
        />
        <View style={styles.text}>
          <Text style={styles.username} numberOfLines={1}>
            {profile.username}
          </Text>
          <View
            style={[
              styles.moodTag,
              { backgroundColor: mood ? mood.tintColor : COLORS.inputBackground },
            ]}
          >
            <Text style={[styles.moodText, !mood && styles.noMoodText]} numberOfLines={1}>
              {moodText ?? "No mood set"}
            </Text>
          </View>
        </View>
      </Pressable>
      <FriendMenu
        username={profile.username}
        isOpen={isMenuOpen}
        onTogglePress={onMenuToggle}
        onViewProfilePress={onOpenProfile}
        onRemovePress={onRemovePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rowWithMenu: { zIndex: 10 },
  details: { flex: 1, flexDirection: "row", alignItems: "center" },
  text: { flex: 1, marginLeft: 14, alignItems: "flex-start" },
  username: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.ink,
  },
  moodTag: {
    marginTop: 4,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    justifyContent: "center",
  },
  moodText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.ink,
  },
  noMoodText: { color: COLORS.grey },
});
