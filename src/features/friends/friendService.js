// Friend service: the Firestore calls for friendships. A friendship's ID is
// the two user IDs sorted and joined with "_", so the same two people can
// never have two friendships.
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  ALREADY_FRIENDS_CODE,
  INVITE_CODE_NOT_FOUND_CODE,
  INVITE_CODE_USED_CODE,
  OWN_INVITE_CODE_CODE,
  createAppError,
} from "../../utils/errors";
import { fetchProfiles } from "../profile/profileService";

// Takes two user IDs and returns them sorted, as the friendship's members.
export function sortFriendIds(uidA, uidB) {
  return [uidA, uidB].sort();
}

// Takes two user IDs and returns the ID of their friendship document.
export function getFriendshipId(uidA, uidB) {
  return sortFriendIds(uidA, uidB).join("_");
}

// Takes the logged-in user's ID and a friend's code, and makes them friends.
// Returns the friend's user ID. Throws one of our errors if the code doesn't
// exist, was already used, is the user's own code, or they are already
// friends.
export async function redeemInviteCode(uid, code) {
  const codeRef = doc(db, "inviteCodes", code);

  // Everything is checked and saved in one transaction: the code is marked
  // as used and the friendship is created together, or nothing changes. So a
  // code can never be used twice, even by two people at the same moment.
  return runTransaction(db, async (transaction) => {
    const codeSnapshot = await transaction.get(codeRef);
    if (!codeSnapshot.exists()) throw createAppError(INVITE_CODE_NOT_FOUND_CODE);

    const invite = codeSnapshot.data();
    if (invite.ownerId === uid) throw createAppError(OWN_INVITE_CODE_CODE);
    if (invite.usedBy !== null) throw createAppError(INVITE_CODE_USED_CODE);

    const friendshipRef = doc(
      db,
      "friendships",
      getFriendshipId(uid, invite.ownerId),
    );
    const friendshipSnapshot = await transaction.get(friendshipRef);
    if (friendshipSnapshot.exists()) throw createAppError(ALREADY_FRIENDS_CODE);

    transaction.update(codeRef, { usedBy: uid, usedAt: serverTimestamp() });
    transaction.set(friendshipRef, {
      members: sortFriendIds(uid, invite.ownerId),
      inviteCode: code,
      createdAt: serverTimestamp(),
    });
    return invite.ownerId;
  });
}

// Takes a user ID and returns the query for all their friendships. Only the
// two friends can read a friendship, so the query must ask for the user's own.
function getMyFriendshipsQuery(uid) {
  return query(
    collection(db, "friendships"),
    where("members", "array-contains", uid),
  );
}

// Takes a friend and returns a number for sorting: the time of their last
// mood change, or 0 when they have none, so the newest moods come first.
function getMoodTime(friend) {
  return friend.profile.moodUpdatedAt?.toMillis() ?? 0;
}

// Takes the logged-in user's ID and returns their friends: a list of
// { friendshipId, uid, profile }, newest mood change first. Friends whose
// profile no longer exists are left out.
export async function fetchFriends(uid) {
  const snapshot = await getDocs(getMyFriendshipsQuery(uid));
  const friendships = snapshot.docs.map((friendshipSnapshot) => ({
    friendshipId: friendshipSnapshot.id,
    uid: friendshipSnapshot.data().members.find((memberUid) => memberUid !== uid),
  }));
  const profiles = await fetchProfiles(friendships.map((friendship) => friendship.uid));
  return friendships
    .filter((friendship) => profiles[friendship.uid])
    .map((friendship) => ({ ...friendship, profile: profiles[friendship.uid] }))
    .sort((friendA, friendB) => getMoodTime(friendB) - getMoodTime(friendA));
}

// Takes the logged-in user's ID and returns how many friends they have. It
// asks Firestore to count, so the friendships are not downloaded.
export async function countFriends(uid) {
  const snapshot = await getCountFromServer(getMyFriendshipsQuery(uid));
  return snapshot.data().count;
}

// A batch can hold at most 500 writes.
const MAX_BATCH_WRITES = 500;

// Takes a friendship's ID and deletes it with all the chat messages under
// it, so the two users are no longer friends (for both of them) and nothing
// is left behind.
export async function removeFriend(friendshipId) {
  const friendshipRef = doc(db, "friendships", friendshipId);
  const messagesSnapshot = await getDocs(collection(friendshipRef, "messages"));
  const messageRefs = messagesSnapshot.docs.map((messageSnapshot) => messageSnapshot.ref);

  // The first batch deletes the friendship together with the first messages
  // (the rules only let messages be deleted with their friendship, or after
  // it is gone). Long chats are finished in more batches of 500.
  const firstBatch = writeBatch(db);
  firstBatch.delete(friendshipRef);
  messageRefs.slice(0, MAX_BATCH_WRITES - 1).forEach((ref) => firstBatch.delete(ref));
  await firstBatch.commit();

  for (let start = MAX_BATCH_WRITES - 1; start < messageRefs.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    messageRefs.slice(start, start + MAX_BATCH_WRITES).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}
