// Friend service: the Firestore calls for friendships. A friendship's ID is
// the two user IDs sorted and joined with "_", so the same two people can
// never have two friendships.
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  ALREADY_FRIENDS_CODE,
  INVITE_CODE_NOT_FOUND_CODE,
  INVITE_CODE_USED_CODE,
  OWN_INVITE_CODE_CODE,
  createAppError,
} from "../../utils/errors";

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
