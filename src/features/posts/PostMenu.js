// The "•••" button on your own post cards and its menu, from the delete post
// mockup. The menu has one action: "Delete post".
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes a function called when "Delete post" is tapped. Shows the "•••"
// button, and the menu below it while it is open.
export default function PostMenu({ onDeletePress }) {
  const [isOpen, setIsOpen] = useState(false);

  // Opens or closes the menu.
  function handleMorePress() {
    setIsOpen((wasOpen) => !wasOpen);
  }

  // Closes the menu, then asks the card to delete the post.
  function handleDeletePress() {
    setIsOpen(false);
    onDeletePress();
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handleMorePress}
        accessibilityRole="button"
        accessibilityLabel="Post options"
        aria-expanded={isOpen}
        style={({ pressed }) => [
          styles.moreButton,
          (isOpen || pressed) && styles.moreButtonOpen,
        ]}
      >
        <Image
          source={require("../../../assets/images/icon-more.svg")}
          style={styles.moreIcon}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.menu} role="menu">
          <Pressable
            onPress={handleDeletePress}
            role="menuitem"
            accessibilityLabel="Delete post"
            style={({ pressed }) => [
              styles.deleteItem,
              pressed && styles.deleteItemPressed,
            ]}
          >
            <Image
              source={require("../../../assets/images/icon-trash.svg")}
              style={styles.deleteIcon}
            />
            <Text style={styles.deleteText}>Delete post</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "flex-start", zIndex: 10 },
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
    top: 46,
    right: 0,
    width: 200,
    padding: 6,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    boxShadow: "0 8px 24px rgba(20, 18, 42, 0.14)",
  },
  deleteItem: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.lightPink,
  },
  deleteItemPressed: { opacity: 0.75 },
  deleteIcon: { width: 18, height: 18, marginRight: 10 },
  deleteText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.error,
  },
});
