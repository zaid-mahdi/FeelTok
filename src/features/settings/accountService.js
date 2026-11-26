// Account service (Task 16): changing the username, email and password, and
// deleting the account with everything the user ever made.
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { WRONG_CURRENT_PASSWORD_CODE, createAppError } from "../../utils/errors";
import { deleteComment } from "../comments/commentService";
import { fetchMyFriendshipIds, removeFriend } from "../friends/friendService";
import { deleteMyInviteCodes } from "../friends/inviteCodeService";
import { deletePost, fetchAllPostsByAuthor } from "../posts/postService";
import { createUsernameTakenError } from "../profile/profileService";
import { setReaction } from "../reactions/reactionService";

// A batch can hold at most 500 writes.
const MAX_BATCH_WRITES = 500;

// Takes a list of document references and a function that adds one change
// to a batch, and saves the changes in batches of 500.
async function writeInBatches(refs, addChange) {
  for (let start = 0; start < refs.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    refs.slice(start, start + MAX_BATCH_WRITES).forEach((ref) => addChange(batch, ref));
    await batch.commit();
  }
}

// Takes a user ID and returns all their comments, on every post (a
// collection group query over all the comments sub-collections).
async function fetchAllMyComments(uid) {
  const snapshot = await getDocs(
    query(collectionGroup(db, "comments"), where("authorId", "==", uid)),
  );
  return snapshot.docs;
}

// Takes a user ID and returns all their reactions, on every post.
async function fetchAllMyReactions(uid) {
  const snapshot = await getDocs(
    query(collectionGroup(db, "reactions"), where("userId", "==", uid)),
  );
  return snapshot.docs;
}

// Checks the user's current password again with Firebase, which it needs
// before changing the email or password or deleting the account. Throws our
// "wrong password" error if it is wrong.
export async function confirmCurrentPassword(password) {
  const user = auth.currentUser;
  try {
    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, password),
    );
  } catch (error) {
    const isWrongPassword = ["auth/wrong-password", "auth/invalid-credential",
      "auth/invalid-login-credentials"].includes(error.code);
    throw isWrongPassword ? createAppError(WRONG_CURRENT_PASSWORD_CODE) : error;
  }
}

// Changes the user's username. Takes their profile (from useAuth) and the new
// username. Throws if the new username is taken.
export async function changeUsername(profile, newUsername) {
  const uid = profile.uid;
  const newUsernameRef = doc(db, "usernames", newUsername);

  // The new username is claimed, the old one given up and the profile
  // changed together, and the new one is checked inside the transaction, so
  // two people can never get the same username.
  await runTransaction(db, async (transaction) => {
    const newUsernameSnapshot = await transaction.get(newUsernameRef);
    if (newUsernameSnapshot.exists()) throw createUsernameTakenError();
    transaction.set(newUsernameRef, { uid });
    transaction.delete(doc(db, "usernames", profile.username));
    transaction.update(doc(db, "users", uid), {
      username: newUsername,
      displayName: newUsername,
    });
  });

  // Then the copies of the username on all the user's posts and comments.
  const posts = await fetchAllPostsByAuthor(uid);
  await writeInBatches(
    posts.map((post) => doc(db, "posts", post.id)),
    (batch, ref) => batch.update(ref, {
      authorUsername: newUsername,
      authorHasPhoto: profile.hasPhoto,
    }),
  );
  const comments = await fetchAllMyComments(uid);
  await writeInBatches(
    comments.map((commentSnapshot) => commentSnapshot.ref),
    (batch, ref) => batch.update(ref, { authorUsername: newUsername }),
  );
}

// Sends a link to the new email. The email changes only after the user opens
// it. Call confirmCurrentPassword first.
export async function changeEmail(newEmail) {
  await verifyBeforeUpdateEmail(auth.currentUser, newEmail.trim());
}

// Changes the password. Call confirmCurrentPassword first.
export async function changePassword(newPassword) {
  await updatePassword(auth.currentUser, newPassword);
}

// Takes a comment and deletes it with its post's count. If the post is
// already gone, deletes only the comment.
async function deleteMyComment(commentSnapshot) {
  const postId = commentSnapshot.ref.parent.parent.id;
  try {
    await deleteComment(postId, commentSnapshot.id);
  } catch {
    await deleteDoc(commentSnapshot.ref);
  }
}

// Takes a reaction and removes it with its post's count. If the post is
// already gone, deletes only the reaction.
async function removeMyReaction(reactionSnapshot, uid) {
  const postId = reactionSnapshot.ref.parent.parent.id;
  try {
    await setReaction(postId, uid, null);
  } catch {
    await deleteDoc(reactionSnapshot.ref);
  }
}

// Deletes the user's account and everything they made, as if it never
// existed. Takes their profile and their password (checked first).
export async function deleteAccount(profile, password) {
  const uid = profile.uid;
  await confirmCurrentPassword(password);

  // The order matters: the rules check the user's profile for most of these
  // steps, so the profile is deleted last, then the login itself.
  // 1. Their posts, with photos and everyone's comments and reactions on them.
  const posts = await fetchAllPostsByAuthor(uid);
  for (const post of posts) await deletePost(post);

  // 2. Their comments and reactions on other people's posts, fixing the counts.
  for (const comment of await fetchAllMyComments(uid)) await deleteMyComment(comment);
  for (const reaction of await fetchAllMyReactions(uid)) await removeMyReaction(reaction, uid);

  // 3. Their friendships (with the chat messages) and invite codes.
  for (const friendshipId of await fetchMyFriendshipIds(uid)) await removeFriend(friendshipId);
  await deleteMyInviteCodes(uid);

  // 4. The profile photo, the username and the profile, together.
  const batch = writeBatch(db);
  if (profile.hasPhoto) batch.delete(doc(db, "profileImages", uid));
  batch.delete(doc(db, "usernames", profile.username));
  batch.delete(doc(db, "users", uid));
  await batch.commit();

  // 5. The login (email and password) in Firebase Authentication.
  await deleteUser(auth.currentUser);
}
