// The white header card of the Friends page, from the Friends mockup: the
// "Friends" title and the pink Invite button. (The friend count, refresh
// button and search box come with the friend list in Task 14.)
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes a function called when Invite is pressed. Shows the header.
export default function FriendsHeader({ onInvitePress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>Friends</Text>
      <View style={styles.actions}>
        <Pressable
          onPress={onInvitePress}
          accessibilityRole="button"
          accessibilityLabel="Invite"
          style={({ pressed }) => [styles.inviteButton, pressed && styles.inviteButtonPressed]}
        >
          <Image
            source={require("../../../assets/images/icon-invite-white.svg")}
            style={styles.inviteIcon}
          />
          <Text style={styles.inviteText}>Invite</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: COLORS.ink,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  inviteButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pink,
    boxShadow: `0 6px 16px ${COLORS.pinkShadow}`,
  },
  inviteButtonPressed: { backgroundColor: COLORS.pinkDeep },
  inviteIcon: { width: 20, height: 20, marginRight: 8 },
  inviteText: {
    fontFamily: FONTS.headingBold,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
  },
});
