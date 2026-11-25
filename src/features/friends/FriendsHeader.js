// The white header card of the Friends page, from the Friends mockup: the
// "Friends" title with the number of friends, the refresh button, the search
// box and the pink Invite button.
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes a number of friends and returns "1 friend" or "7 friends".
function formatFriendCount(count) {
  return `${count} ${count === 1 ? "friend" : "friends"}`;
}

// Takes the number of friends (null while loading), the search text and its
// change function, isRefreshing, and functions for refresh and Invite.
export default function FriendsHeader({
  friendCount,
  searchText,
  onSearchChange,
  isRefreshing,
  onRefreshPress,
  onInvitePress,
}) {
  const insets = useSafeAreaInsets();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.count}>
            {friendCount === null ? " " : formatFriendCount(friendCount)}
          </Text>
        </View>
        <Pressable
          onPress={onRefreshPress}
          disabled={isRefreshing}
          accessibilityRole="button"
          accessibilityLabel="Refresh friends"
          style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshButtonPressed]}
        >
          {isRefreshing ? (
            <ActivityIndicator color={COLORS.ink} />
          ) : (
            <Image
              source={require("../../../assets/images/icon-refresh.svg")}
              style={styles.refreshIcon}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.actions}>
        {/* Filters only the friends already on screen; it doesn't search the
            database (team decision). */}
        <View style={[styles.search, isSearchFocused && styles.searchFocused]}>
          <Image
            source={require("../../../assets/images/icon-search.svg")}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchText}
            onChangeText={onSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search friends"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search friends"
            style={styles.searchInput}
          />
        </View>
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
    zIndex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: COLORS.ink,
  },
  count: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.inputBackground,
  },
  refreshButtonPressed: { backgroundColor: COLORS.border },
  refreshIcon: { width: 20, height: 20 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  search: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
  },
  searchFocused: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    boxShadow: `0 0 0 3px ${COLORS.purpleGlow}`,
  },
  searchIcon: { width: 18, height: 18, marginRight: 8 },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.ink,
    // Hides the browser's own outline, because searchFocused replaces it.
    ...Platform.select({ web: { outlineStyle: "none" } }),
  },
  inviteButton: {
    height: 48,
    paddingHorizontal: 18,
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
