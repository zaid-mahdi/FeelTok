// Auth service: all the calls to Firebase Authentication.
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

// Logs a user in with their email and password. Throws a Firebase error if
// the login fails.
export async function logIn(email, password) {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

// Logs the current user out.
export async function logOut() {
  await signOut(auth);
}
