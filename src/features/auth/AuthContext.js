// Auth context: shares the logged-in user with every screen.
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

const AuthContext = createContext(null);

// Wraps the app and gives every screen inside it the current login state.
// Takes the screens as children.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase calls this once when it has checked for a saved login, and again
  // after every login or logout. Returning it stops listening on unmount.
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Returns the login state: user (null when logged out) and isLoading (true
// while Firebase is still checking for a saved login).
export function useAuth() {
  return useContext(AuthContext);
}
