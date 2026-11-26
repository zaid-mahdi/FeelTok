// Reaction service: the Firestore calls for reacting to posts with a mood.
// Each user's reaction is posts/{postId}/reactions/{uid} (it also stores the
// userId, so a user's reactions can be found), and the post keeps a count per
// mood in reactionCounts.
import { doc, getDoc, increment, runTransaction } from "firebase/firestore";
import { db } from "../../lib/firebase";

// Takes a post ID and a user ID, and returns where that user's reaction is.
function getReactionRef(postId, uid) {
  return doc(db, "posts", postId, "reactions", uid);
}

// Sets, switches or removes the user's reaction to a post. Takes the post
// ID, the user's ID and the new mood key, or null to remove the reaction.
export async function setReaction(postId, uid, newMoodKey) {
  const postRef = doc(db, "posts", postId);
  const reactionRef = getReactionRef(postId, uid);

  // The reaction and the post's counts change together, and the old reaction
  // is read inside the transaction, so the counts stay right even when the
  // user taps fast or many people react at the same time.
  await runTransaction(db, async (transaction) => {
    const reactionSnapshot = await transaction.get(reactionRef);
    const oldMoodKey = reactionSnapshot.exists()
      ? reactionSnapshot.data().reaction
      : null;
    if (oldMoodKey === newMoodKey) return;

    const countChanges = {};
    if (oldMoodKey) countChanges[`reactionCounts.${oldMoodKey}`] = increment(-1);
    if (newMoodKey) countChanges[`reactionCounts.${newMoodKey}`] = increment(1);
    transaction.update(postRef, countChanges);

    if (newMoodKey) {
      transaction.set(reactionRef, { reaction: newMoodKey, userId: uid });
    } else {
      transaction.delete(reactionRef);
    }
  });
}

// Takes a list of post IDs and the user's ID, and returns the user's
// reaction to each post: an object of post ID → mood key. Posts without a
// reaction are left out.
export async function fetchMyReactions(postIds, uid) {
  const snapshots = await Promise.all(
    postIds.map((postId) => getDoc(getReactionRef(postId, uid))),
  );
  const myReactions = {};
  snapshots.forEach((snapshot, index) => {
    if (snapshot.exists()) myReactions[postIds[index]] = snapshot.data().reaction;
  });
  return myReactions;
}
