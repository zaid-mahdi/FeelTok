// Auth service: all the calls to Firebase Authentication.
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ACCOUNT_BLOCKED_CODE, createAppError } from "../../utils/errors";
import { setIsLoggingIn } from "./blockedNotice";
import {
  createUserProfile,
  createUsernameTakenError,
  fetchProfile,
  isUsernameFree,
} from "../profile/profileService";

// Creates a new account with its profile and logs the user in. Throws an error
// if the username or email is taken, or if anything else fails.
export async function signUp(email, username, password) {
  const isFree = await isUsernameFree(username);
  if (!isFree) throw createUsernameTakenError();

  const { user } = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  // An account without a profile can't be used and keeps the email taken, so
  // we remove it. The user can then try again.
  try {
    await createUserProfile(user.uid, username);
  } catch (error) {
    await removeUnfinishedAccount(user);
    throw error;
  }
}

// Deletes a new account that has no profile. If that fails too, at least logs
// the user out. Takes the Firebase user.
async function removeUnfinishedAccount(user) {
  try {
    await deleteUser(user);
  } catch {
    await logOut();
  }
}

// Logs a user in with their email and password. Throws a Firebase error if
// the login fails, or our "blocked" error (and logs out again) if an admin
// blocked the account.
export async function logIn(email, password) {
  setIsLoggingIn(true);
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await fetchProfile(user.uid);
    if (profile?.banned) {
      await logOut();
      throw createAppError(ACCOUNT_BLOCKED_CODE);
    }
  } finally {
    setIsLoggingIn(false);
  }
}

// Sends a password reset link to the given email. Does nothing if no account
// uses it, so nobody can find out who has an account. Throws other errors.
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;
  }
}

// Logs the current user out.
export async function logOut() {
  await signOut(auth);
}
