// Friend List tab, from the Friends mockup: my friends with their current
// moods (loaded when the tab opens, with pull to refresh and the refresh
// button), a search box that filters them, the message button (opens the
// chat), the ⋮ menu (View profile, Remove friend), and the Invite button that
// opens "Invite a friend".
import { Redirect, router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import ConfirmDialog from "../../src/components/ConfirmDialog";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";
import FriendList from "../../src/features/friends/FriendList";
import FriendsHeader from "../../src/features/friends/FriendsHeader";
import InviteFriendModal from "../../src/features/friends/InviteFriendModal";
import useFriends from "../../src/features/friends/useFriends";
import { openUserProfile } from "../../src/features/profile/openUserProfile";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";
import { friendlyError } from "../../src/utils/errors";

// Takes the friends and the search text and returns the friends whose
// username contains it (all of them when the search is empty).
function filterFriends(friends, searchText) {
  const search = searchText.trim().toLowerCase();
  if (!search) return friends;
  return friends.filter((friend) => friend.profile.username.includes(search));
}

// Shows the Friends page. Logged-out users are sent to login.
export default function FriendsScreen() {
  const { user } = useAuth();
  const { friends, isLoading, isRefreshing, errorMessage, refresh, removeFriendById } =
    useFriends(user?.uid ?? null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openMenuFriendshipId, setOpenMenuFriendshipId] = useState(null);
  const [removeErrorMessage, setRemoveErrorMessage] = useState(null);
  // The friend in the "Remove …?" pop-up (null when it is closed).
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Tabs stay open behind other pages, so the list loads again each time the
  // tab comes back into view (not the first time: it is loading then).
  const hasBeenFocusedRef = useRef(false);
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  useFocusEffect(
    useCallback(() => {
      if (hasBeenFocusedRef.current) refreshRef.current();
      hasBeenFocusedRef.current = true;
    }, []),
  );

  // Loads the list again (pull to refresh or the refresh button).
  function handleRefresh() {
    setOpenMenuFriendshipId(null);
    setRemoveErrorMessage(null);
    refresh();
  }

  // Opens or closes this friend's menu, and closes any other one.
  function handleMenuToggle(friend) {
    setOpenMenuFriendshipId((openId) =>
      openId === friend.friendshipId ? null : friend.friendshipId,
    );
  }

  // Closes the menu and opens the friend's profile.
  function handleOpenProfile(friend) {
    setOpenMenuFriendshipId(null);
    openUserProfile(friend.uid);
  }

  // Closes the menu and opens the chat with the friend.
  function handleOpenChat(friend) {
    setOpenMenuFriendshipId(null);
    router.push(`/chat/${friend.uid}`);
  }

  // Closes the menu and opens the "Remove …?" pop-up.
  function handleRemovePress(friend) {
    setOpenMenuFriendshipId(null);
    setFriendToRemove(friend);
  }

  // Removes the friend for both users, then closes the pop-up. If it fails,
  // the pop-up closes and the error shows above the list.
  async function handleConfirmRemove() {
    setIsRemoving(true);
    setRemoveErrorMessage(null);
    try {
      await removeFriendById(friendToRemove.friendshipId);
    } catch (error) {
      setRemoveErrorMessage(friendlyError(error));
    } finally {
      setIsRemoving(false);
      setFriendToRemove(null);
    }
  }

  if (!user) return <Redirect href="/login" />;

  const shownFriends = friends ? filterFriends(friends, searchText) : [];
  const emptyMessage =
    friends && friends.length > 0
      ? `No friends match "${searchText.trim()}".`
      : "No friends yet. Tap Invite to share your code, or add a friend with theirs.";

  return (
    <View style={styles.page}>
      <FriendsHeader
        friendCount={friends ? friends.length : null}
        searchText={searchText}
        onSearchChange={setSearchText}
        isRefreshing={isRefreshing && !isLoading}
        onRefreshPress={handleRefresh}
        onInvitePress={() => setIsInviteOpen(true)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing && !isLoading}
            onRefresh={handleRefresh}
            tintColor={COLORS.purple}
            colors={[COLORS.purple]}
          />
        }
      >
        <ErrorText message={removeErrorMessage} />
        {isLoading && <LoadingSpinner />}
        {!isLoading && errorMessage && (
          <View style={styles.errorBox}>
            <ErrorText message={errorMessage} />
            <Text style={styles.retry} onPress={handleRefresh} accessibilityRole="button">
              Try again
            </Text>
          </View>
        )}
        {!isLoading && !errorMessage && friends && (
          <FriendList
            friends={shownFriends}
            openMenuFriendshipId={openMenuFriendshipId}
            emptyMessage={emptyMessage}
            onOpenProfile={handleOpenProfile}
            onOpenChat={handleOpenChat}
            onMenuToggle={handleMenuToggle}
            onRemovePress={handleRemovePress}
          />
        )}
      </ScrollView>

      <ConfirmDialog
        isVisible={friendToRemove !== null}
        emoji="😨"
        title={`Remove ${friendToRemove?.profile.username}?`}
        message="You'll be removed from each other's friend lists and their posts will leave your Friends feed. You can add them again with a new invite code."
        confirmText="Remove"
        isConfirming={isRemoving}
        onConfirm={handleConfirmRemove}
        onCancel={() => setFriendToRemove(null)}
      />

      {isInviteOpen && (
        <InviteFriendModal
          uid={user.uid}
          onClose={() => setIsInviteOpen(false)}
          onFriendAdded={refresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
  content: { padding: 16, paddingBottom: 120 },
  errorBox: { alignItems: "center", padding: 24 },
  retry: {
    marginTop: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.purple,
  },
});
