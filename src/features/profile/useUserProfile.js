// Hook for a public profile page: loads one user's profile.
import { useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchProfile } from "./profileService";

// Takes a user ID. Returns the profile (null while loading or when the user
// doesn't exist), isLoading, and an error message (or null).
export default function useUserProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setErrorMessage(null);
    fetchProfile(uid)
      .then((loadedProfile) => {
        if (isCurrent) setProfile(loadedProfile);
      })
      .catch((error) => {
        if (isCurrent) setErrorMessage(friendlyError(error));
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [uid]);

  return { profile, isLoading, errorMessage };
}
