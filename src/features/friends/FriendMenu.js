// The "⋮" button on each friend and its menu, from the Friends mockup:
// "View profile" and "Remove friend".
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the friend's username, isOpen, and functions for the ⋮ button and
// the two menu items. The list decides which menu is open, so only one is.
export default function FriendMenu({
  username,
  isOpen,
  onTogglePress,
  onViewProfilePress,
  onRemovePress,
}) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onTogglePress}
        accessibilityRole="button"
        accessibilityLabel={`Options for @${username}`}
        aria-expanded={isOpen}
        style={({ pressed }) => [
          styles.moreButton,
          (isOpen || pressed) && styles.moreButtonOpen,
        ]}
      >
        <Image
          source={require("../../../assets/images/icon-more-vertical.svg")}
          style={styles.moreIcon}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.menu} role="menu">
          <Pressable
            onPress={onViewProfilePress}
            role="menuitem"
            accessibilityLabel="View profile"
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            <Image
              source={require("../../../assets/images/icon-profile-dark.svg")}
              style={styles.itemIcon}
            />
            <Text style={styles.itemText}>View profile</Text>
          </Pressable>
          <Pressable
            onPress={onRemovePress}
            role="menuitem"
            accessibilityLabel="Remove friend"
            style={({ pressed }) => [
              styles.item,
              styles.removeItem,
              pressed && styles.removeItemPressed,
            ]}
          >
            <Image
              source={require("../../../assets/images/icon-remove-friend.svg")}
              style={styles.itemIcon}
            />
            <Text style={[styles.itemText, styles.removeText]}>Remove friend</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { zIndex: 10 },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonOpen: { backgroundColor: COLORS.lightPurple },
  moreIcon: { width: 20, height: 20 },
  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    width: 200,
    padding: 6,
    gap: 4,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    boxShadow: "0 8px 24px rgba(20, 18, 42, 0.14)",
  },
  item: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  itemPressed: { backgroundColor: COLORS.inputBackground },
  removeItem: { backgroundColor: COLORS.lightPink },
  removeItemPressed: { opacity: 0.75 },
  itemIcon: { width: 18, height: 18, marginRight: 10 },
  itemText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.ink,
  },
  removeText: { color: COLORS.error },
});
