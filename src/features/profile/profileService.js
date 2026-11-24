// Profile service: the Firestore calls for usernames and user profiles.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
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

// Takes a list of user IDs and returns their profiles: an object of user ID →
// profile. Users without a profile are left out.
export async function fetchProfiles(uids) {
  const uniqueUids = [...new Set(uids)];
  const snapshots = await Promise.all(
    uniqueUids.map((uid) => getDoc(doc(db, "users", uid))),
  );
  const profiles = {};
  snapshots.forEach((snapshot, index) => {
    if (snapshot.exists()) {
      profiles[uniqueUids[index]] = { uid: uniqueUids[index], ...snapshot.data() };
    }
  });
  return profiles;
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

// Takes a user ID and returns their profile photo as a data URI that an Image
// can show, or null if they have none.
export async function fetchProfilePhoto(uid) {
  const photoSnapshot = await getDoc(doc(db, "profileImages", uid));
  if (!photoSnapshot.exists()) return null;
  return `data:image/jpeg;base64,${photoSnapshot.data().data}`;
}

// A Firestore batch can hold at most 500 changes.
const MAX_BATCH_WRITES = 500;

// Saves a new profile photo for the user. Takes the user's ID and the photo's
// base64 text. The old photo, if any, is replaced.
export async function saveProfilePhoto(uid, photoBase64) {
  const userRef = doc(db, "users", uid);

  // Posts keep a copy of "has a photo" (authorHasPhoto) so the feed doesn't
  // have to read every author's profile. The first photo turns it on for all
  // the user's posts.
  const postsSnapshot = await getDocs(
    query(collection(db, "posts"), where("authorId", "==", uid)),
  );
  const postRefs = postsSnapshot.docs
    .filter((postSnapshot) => postSnapshot.data().authorHasPhoto !== true)
    .map((postSnapshot) => postSnapshot.ref);

  // The photo and the profile's hasPhoto are saved together (firestore.rules
  // checks this), with as many posts as fit. A user with hundreds of posts
  // gets the rest in more batches.
  const firstBatch = writeBatch(db);
  firstBatch.set(doc(db, "profileImages", uid), {
    data: photoBase64,
    updatedAt: serverTimestamp(),
  });
  firstBatch.update(userRef, { hasPhoto: true });
  const roomInFirstBatch = MAX_BATCH_WRITES - 2;
  postRefs
    .slice(0, roomInFirstBatch)
    .forEach((ref) => firstBatch.update(ref, { authorHasPhoto: true }));
  await firstBatch.commit();

  const leftOver = postRefs.slice(roomInFirstBatch);
  for (let start = 0; start < leftOver.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    leftOver
      .slice(start, start + MAX_BATCH_WRITES)
      .forEach((ref) => batch.update(ref, { authorHasPhoto: true }));
    await batch.commit();
  }
}

// Saves the user's bio. Takes the user's ID and the new bio (at most 150
// characters; spaces at the start and end are removed).
export async function saveBio(uid, bio) {
  await updateDoc(doc(db, "users", uid), { bio: bio.trim() });
}

// Saves the user's current mood. Takes the user's ID and one of the 6 user
// mood keys.
export async function saveMood(uid, moodKey) {
  await updateDoc(doc(db, "users", uid), {
    mood: moodKey,
    moodUpdatedAt: serverTimestamp(),
  });
}
