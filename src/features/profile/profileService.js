// Profile service: the Firestore calls for usernames and user profiles.
import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { USERNAME_TAKEN_CODE } from "../../utils/errors";

// Returns the error used when another user already has the username.
export function createUsernameTakenError() {
  const error = new Error("This username is already taken.");
  error.code = USERNAME_TAKEN_CODE;
  return error;
}

// Listens to a user's profile and calls onProfile(profile, isFromServer) every
// time it changes. profile is null if the user has no profile. isFromServer is
// false while the answer comes from the phone's or browser's saved copy, and
// it is sent again once the server confirms it. Calls onError if it can't be
// read. Returns a function that stops listening.
export function subscribeToProfile(uid, onProfile, onError) {
  return onSnapshot(
    doc(db, "users", uid),
    { includeMetadataChanges: true },
    (snapshot) => {
      const profile = snapshot.exists() ? { uid, ...snapshot.data() } : null;
      onProfile(profile, !snapshot.metadata.fromCache);
    },
    onError,
  );
}

// Takes a username and returns true if nobody uses it yet.
export async function isUsernameFree(username) {
  const usernameSnapshot = await getDoc(doc(db, "usernames", username));
  return !usernameSnapshot.exists();
}

// Claims the username and creates the profile of a new user. Takes the user's
// ID and username. Throws an error if the username is already taken.
export async function createUserProfile(uid, username) {
  const usernameRef = doc(db, "usernames", username);
  const userRef = doc(db, "users", uid);

  // Both documents are saved together or not at all, and the username is
  // checked again here, so two people can never claim the same one.
  await runTransaction(db, async (transaction) => {
    const usernameSnapshot = await transaction.get(usernameRef);
    if (usernameSnapshot.exists()) throw createUsernameTakenError();

    transaction.set(usernameRef, { uid });
    transaction.set(userRef, {
      username,
      displayName: username,
      bio: "",
      hasPhoto: false,
      mood: null,
      moodUpdatedAt: null,
      role: "user",
      banned: false,
      createdAt: serverTimestamp(),
    });
  });
}
