// Auth context: shares the logged-in user and their profile with every screen.
import { onAuthStateChanged, signOut } from "firebase/auth";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { isWeb } from "../../utils/platform";
import { subscribeToProfile } from "../profile/profileService";
import { getIsLoggingIn, markJustBlocked } from "./blockedNotice";

const AuthContext = createContext(null);

// Wraps the app and gives every screen inside it the current login state and
// the user's live profile. Takes the screens as children.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // The profile, its error and the ID of the user they belong to, so a profile
  // from an earlier login is never shown for a new one.
  const [profileState, setProfileState] = useState({ uid: null });
  const uid = user?.uid ?? null;

  // Firebase calls this once when it has checked for a saved login, and again
  // after every login or logout. Returning it stops listening on unmount.
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecked(true);
    });
  }, []);

  // While someone is logged in, listen to their profile so changes (like a new
  // role) show at once. On logout it stops listening and forgets the profile,
  // so the next login starts fresh. On the web the admin check must not use an
  // old saved copy of the role, so there we wait for the server's answer.
  useEffect(() => {
    if (!uid) return undefined;
    const stopListening = subscribeToProfile(
      uid,
      (profile, isFromServer) => {
        if (isWeb && !isFromServer) return;
        // A user an admin blocks while they are logged in is logged out at
        // once and sent to the login page, which says why. (When they try
        // to log in, logIn() refuses and the form says it.)
        if (profile?.banned && isFromServer) {
          signOut(auth);
          if (!getIsLoggingIn()) {
            markJustBlocked();
            router.replace("/login");
          }
          return;
        }
        setProfileState({ uid, profile, error: null });
      },
      (error) => setProfileState({ uid, profile: null, error }),
    );
    return () => {
      stopListening();
      setProfileState({ uid: null });
    };
  }, [uid]);

  const hasCurrentProfileState = uid !== null && profileState.uid === uid;
  const profile = hasCurrentProfileState ? profileState.profile : null;
  const profileError = hasCurrentProfileState ? profileState.error : null;
  const isLoading = !isAuthChecked || (uid !== null && !hasCurrentProfileState);
  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, profileError, isAdmin, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Returns the login state: user (null when logged out), profile (the user's
// Firestore profile, or null), profileError (set if the profile can't be read),
// isAdmin, and isLoading (true while the login or the profile is being checked).
export function useAuth() {
  return useContext(AuthContext);
}
