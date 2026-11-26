// Hook for the chat page: listens to the messages between the logged-in user
// and one friend, live, while the page is open.
import { useCallback, useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { getFriendshipId } from "../friends/friendService";
import { sendMessage, subscribeToMessages } from "./chatService";

// Takes the logged-in user's ID and the friend's ID. Returns messages
// (newest first), isLoading, errorMessage, isNotFriends (true when the rules
// refuse the chat, because the two are not friends), and send(text), which
// throws if the message couldn't be sent.
export default function useChat(uid, friendUid) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isNotFriends, setIsNotFriends] = useState(false);
  const friendshipId = uid && friendUid ? getFriendshipId(uid, friendUid) : null;

  useEffect(() => {
    if (!friendshipId) return undefined;
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFriends(false);
    return subscribeToMessages(
      friendshipId,
      (newMessages) => {
        setMessages(newMessages);
        setIsLoading(false);
      },
      (error) => {
        if (error.code === "permission-denied") setIsNotFriends(true);
        else setErrorMessage(friendlyError(error));
        setIsLoading(false);
      },
    );
  }, [friendshipId]);

  const send = useCallback(
    (text) => sendMessage(friendshipId, uid, text),
    [friendshipId, uid],
  );

  return { messages, isLoading, errorMessage, isNotFriends, send };
}
