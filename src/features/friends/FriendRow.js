// One friend in the friend list, from the Friends mockup: avatar with mood
// ring and emoji, @username, their current mood with how long ago they set
// it ("feeling love · 10m"), the message button (opens the chat) and the ⋮
// menu.
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import Avatar from "../profile/Avatar";
import FriendMenu from "./FriendMenu";
import FriendMoodTag from "./FriendMoodTag";

// Takes the friend ({ uid, profile }), isMenuOpen, and functions to open the
// profile, open the chat, open or close the menu, and remove the friend.
// Tapping the row opens their profile.
export default function FriendRow({
  friend,
  isMenuOpen,
  onOpenProfile,
  onMessagePress,
  onMenuToggle,
  onRemovePress,
}) {
  const { profile } = friend;

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
          <FriendMoodTag profile={profile} />
        </View>
      </Pressable>
      <Pressable
        onPress={onMessagePress}
        accessibilityRole="button"
        accessibilityLabel={`Message @${profile.username}`}
        style={({ pressed }) => [styles.messageButton, pressed && styles.messageButtonPressed]}
      >
        <Image
          source={require("../../../assets/images/icon-chat-purple.svg")}
          style={styles.messageIcon}
        />
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
  messageButton: {
    width: 40,
    height: 40,
    marginRight: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },
  messageButtonPressed: { opacity: 0.75 },
  messageIcon: { width: 18, height: 18 },
});
