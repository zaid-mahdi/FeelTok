// Chat page (Task 15), from the chat mockup: the messages between the
// logged-in user and one friend (the uid in the address), live while the page
// is open, and a box to send a new one. Only friends can chat.
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAuth } from "../../src/features/auth/AuthContext";
import ChatHeader from "../../src/features/chat/ChatHeader";
import MessageItem from "../../src/features/chat/MessageItem";
import useChat from "../../src/features/chat/useChat";
import CommentInput from "../../src/features/comments/CommentInput";
import { openUserProfile } from "../../src/features/profile/openUserProfile";
import useUserProfile from "../../src/features/profile/useUserProfile";
import { COLORS } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/fonts";
import { friendlyError } from "../../src/utils/errors";
import { isSameDay } from "../../src/utils/time";
import { MAX_MESSAGE_CHARACTERS } from "../../src/utils/validation";

// Goes back to the page before, or to the Friend List tab when the chat was
// opened directly.
function handleBackPress() {
  if (router.canGoBack()) router.back();
  else router.replace("/friends");
}

// Shows a message in the middle of the chat area.
function CenterMessage({ children }) {
  return <View style={styles.center}>{children}</View>;
}

// Shows the chat with the friend in the address. Logged-out users are sent
// to login.
export default function ChatScreen() {
  const { uid: friendUid } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const friend = useUserProfile(friendUid);
  const chat = useChat(user?.uid ?? null, friendUid);
  const [sendErrorMessage, setSendErrorMessage] = useState(null);

  // Sends the message. Returns true when it was sent, so the box empties.
  async function handleSend(text) {
    setSendErrorMessage(null);
    try {
      await chat.send(text);
      return true;
    } catch (error) {
      setSendErrorMessage(friendlyError(error));
      return false;
    }
  }

  if (!user) return <Redirect href="/login" />;

  const username = friend.profile?.username;
  const canChat = Boolean(friend.profile) && !chat.isNotFriends && !chat.errorMessage;

  // The middle of the page: loading, an error, "not friends", or the
  // messages. The list is upside down (newest at the bottom, next to the
  // box), so the messages come newest first.
  let content;
  if (friend.isLoading || chat.isLoading) {
    content = <LoadingSpinner />;
  } else if (friend.errorMessage || chat.errorMessage) {
    content = (
      <CenterMessage>
        <ErrorText message={friend.errorMessage ?? chat.errorMessage} />
      </CenterMessage>
    );
  } else if (!friend.profile) {
    content = (
      <CenterMessage>
        <Text style={styles.centerText}>This user doesn't exist.</Text>
      </CenterMessage>
    );
  } else if (chat.isNotFriends) {
    content = (
      <CenterMessage>
        <Text style={styles.centerText}>
          You can only chat with friends. Add @{username} with their invite code first.
        </Text>
      </CenterMessage>
    );
  } else if (chat.messages.length === 0) {
    content = (
      <CenterMessage>
        <Text style={styles.centerText}>Say hi to @{username} 👋</Text>
      </CenterMessage>
    );
  } else {
    content = (
      <FlatList
        inverted
        data={chat.messages}
        keyExtractor={(message) => message.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const olderMessage = chat.messages[index + 1];
          return (
            <MessageItem
              message={item}
              isMine={item.senderId === user.uid}
              hasDayLabel={!olderMessage || !isSameDay(item.createdAt, olderMessage.createdAt)}
            />
          );
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader
        friendUid={friendUid}
        profile={friend.profile}
        onBackPress={handleBackPress}
        onFriendPress={() => openUserProfile(friendUid)}
      />
      <View style={styles.messages}>{content}</View>
      {canChat && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <ErrorText message={sendErrorMessage} />
          <CommentInput
            onSend={handleSend}
            placeholder="Write a kind message..."
            inputLabel="Write a message"
            sendLabel="Send message"
            maxLength={MAX_MESSAGE_CHARACTERS}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
  messages: { flex: 1 },
  list: { paddingHorizontal: 16, paddingVertical: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  centerText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.grey,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
