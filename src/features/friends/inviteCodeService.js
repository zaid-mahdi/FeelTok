// Invite code service: the Firestore calls for making and finding a user's
// invite code. The code is the document ID in inviteCodes, so codes are unique.
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  INVITE_CODE_ALPHABET,
  INVITE_CODE_LENGTH,
} from "../../utils/validation";

// How many new codes to try if the first ones are already taken.
const MAX_CODE_TRIES = 5;

// Returns a random code of 6 characters from the invite code alphabet.
export function generateInviteCode() {
  let code = "";
  for (let index = 0; index < INVITE_CODE_LENGTH; index += 1) {
    const randomIndex = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[randomIndex];
  }
  return code;
}

// Takes a user ID and returns one of their codes that nobody has used yet,
// or null if they have none. It reads only their own codes, and picks the
// unused one in the app, so no extra index is needed.
export async function fetchUnusedInviteCode(uid) {
  const snapshot = await getDocs(
    query(collection(db, "inviteCodes"), where("ownerId", "==", uid)),
  );
  const unusedCode = snapshot.docs.find(
    (codeSnapshot) => codeSnapshot.data().usedBy === null,
  );
  return unusedCode ? unusedCode.id : null;
}

// Takes a user ID, makes a new code for them and returns it. Each try runs in
// a transaction that checks the code is still free before saving it. If it
// is taken, it tries another random code, up to 5 times.
export async function createInviteCode(uid) {
  for (let tryNumber = 1; tryNumber <= MAX_CODE_TRIES; tryNumber += 1) {
    const code = generateInviteCode();
    const codeRef = doc(db, "inviteCodes", code);
    const isSaved = await runTransaction(db, async (transaction) => {
      const codeSnapshot = await transaction.get(codeRef);
      if (codeSnapshot.exists()) return false;
      transaction.set(codeRef, {
        ownerId: uid,
        usedBy: null,
        usedAt: null,
        createdAt: serverTimestamp(),
      });
      return true;
    });
    if (isSaved) return code;
  }
  throw new Error("Could not make a free invite code.");
}

// Takes a user ID and returns their unused code, or makes a new one when
// they have none (also after a friend used their last one).
export async function getOrCreateInviteCode(uid) {
  const unusedCode = await fetchUnusedInviteCode(uid);
  return unusedCode ?? (await createInviteCode(uid));
}
