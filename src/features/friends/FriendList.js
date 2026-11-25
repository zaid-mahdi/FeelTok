// The white card with the friend rows on the Friends page, from the Friends
// mockup. Only one friend's ⋮ menu is open at a time.
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import FriendRow from "./FriendRow";

// Takes the friends to show, the friendship ID whose menu is open (or null),
// a message for when the list is empty, and functions to open a profile,
// open or close a menu, and remove a friend.
export default function FriendList({
  friends,
  openMenuFriendshipId,
  emptyMessage,
  onOpenProfile,
  onMenuToggle,
  onRemovePress,
}) {
  if (friends.length === 0) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {friends.map((friend) => (
        <FriendRow
          key={friend.friendshipId}
          friend={friend}
          isMenuOpen={openMenuFriendshipId === friend.friendshipId}
          onOpenProfile={() => onOpenProfile(friend)}
          onMenuToggle={() => onMenuToggle(friend)}
          onRemovePress={() => onRemovePress(friend)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  emptyCard: { padding: 24, alignItems: "center" },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.grey,
    textAlign: "center",
  },
});
