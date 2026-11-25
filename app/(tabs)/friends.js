// Friend List tab, from the Friends mockup. Task 13: the header with the
// Invite button, which opens "Invite a friend" (my code, and adding a friend
// with theirs). The friend list itself comes in Task 14.
import { Redirect } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/features/auth/AuthContext";
import FriendsHeader from "../../src/features/friends/FriendsHeader";
import InviteFriendModal from "../../src/features/friends/InviteFriendModal";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";

// Shows the Friends page. Logged-out users are sent to login.
export default function FriendsScreen() {
  const { user } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!user) return <Redirect href="/login" />;

  return (
    <View style={styles.page}>
      <FriendsHeader onInvitePress={() => setIsInviteOpen(true)} />

      {/* Temporary until the friend list is built in Task 14. */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your friends will show here</Text>
        <Text style={styles.cardText}>
          Tap Invite to share your code, or to add a friend with theirs.
        </Text>
      </View>

      {isInviteOpen && (
        <InviteFriendModal uid={user.uid} onClose={() => setIsInviteOpen(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  cardTitle: {
    fontFamily: FONTS.headingSemiBold,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.ink,
    textAlign: "center",
  },
  cardText: {
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.grey,
    textAlign: "center",
  },
});
