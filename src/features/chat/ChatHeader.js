// The top of the chat page, from the chat mockup: back button, the friend's
// avatar with mood ring and emoji, their username and current mood.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import FriendMoodTag from "../friends/FriendMoodTag";
import Avatar from "../profile/Avatar";

// Takes the friend's ID and profile (or null while loading), and functions
// for the back button and for tapping the friend (opens their profile).
export default function ChatHeader({ friendUid, profile, onBackPress, onFriendPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <BackButton onPress={onBackPress} />
      {profile && (
        <Pressable
          onPress={onFriendPress}
          accessibilityRole="link"
          accessibilityLabel={`Open @${profile.username}'s profile`}
          style={styles.friend}
        >
          <Avatar
            name={profile.username}
            uid={friendUid}
            hasPhoto={profile.hasPhoto}
            moodKey={profile.mood}
            size={48}
            hasBadge
          />
          <View style={styles.text}>
            <Text style={styles.username} numberOfLines={1}>
              {profile.username}
            </Text>
            <FriendMoodTag profile={profile} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    boxShadow: "0 4px 12px rgba(20, 18, 42, 0.05)",
    zIndex: 1,
  },
  friend: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 12 },
  text: { flex: 1, marginLeft: 12 },
  username: {
    fontFamily: FONTS.headingBold,
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.ink,
  },
});
