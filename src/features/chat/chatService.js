// Chat service: the Firestore calls for messages between two friends.
// Messages are kept under their friendship, in
// friendships/{friendshipId}/messages, so only the two friends can read them.
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// How many of the newest messages a chat loads (MVP: no older pages).
const MESSAGES_PER_CHAT = 50;

// Takes a friendship ID and returns its messages collection.
function getMessagesCollection(friendshipId) {
  return collection(db, "friendships", friendshipId, "messages");
}

// Listens to the newest 50 messages of a chat and calls onMessages(messages)
// every time they change, newest first. Each message has its id, senderId,
// text and createdAt (an estimate while the server is still saving it).
// Calls onError if they can't be read (for example when the two users are not
// friends). Returns a function that stops listening.
export function subscribeToMessages(friendshipId, onMessages, onError) {
  const newestMessages = query(
    getMessagesCollection(friendshipId),
    orderBy("createdAt", "desc"),
    limit(MESSAGES_PER_CHAT),
  );
  return onSnapshot(
    newestMessages,
    (snapshot) => {
      onMessages(
        snapshot.docs.map((messageSnapshot) => ({
          id: messageSnapshot.id,
          ...messageSnapshot.data({ serverTimestamps: "estimate" }),
        })),
      );
    },
    onError,
  );
}

// Sends a message. Takes the friendship ID, the sender's user ID and the
// text (trimmed before saving).
export async function sendMessage(friendshipId, senderId, text) {
  await addDoc(getMessagesCollection(friendshipId), {
    senderId,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
