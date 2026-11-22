// Auth service: all the calls to Firebase Authentication.
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

// Logs a user in with their email and password. Throws a Firebase error if
// the login fails.
export async function logIn(email, password) {
  await signInWithEmailAndPassword(auth, email.trim(), password);
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
