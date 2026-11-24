// Hook for the numbers on a profile: posts and reactions.
import { useCallback, useEffect, useState } from "react";
import { fetchAuthorStats } from "../posts/postService";

// Takes a user ID. Returns postCount and reactionCount (null while loading or
// if they couldn't be loaded) and reload, to count again (for example after a
// post is deleted).
export default function useProfileStats(uid) {
  const [stats, setStats] = useState({ postCount: null, reactionCount: null });

  // Asks Firestore for the numbers again.
  const reload = useCallback(async () => {
    if (!uid) return;
    try {
      setStats(await fetchAuthorStats(uid));
    } catch (error) {
      // Shown in the Expo terminal, so a missing index or rule can be found.
      console.warn("Could not load the profile numbers:", error);
      setStats({ postCount: null, reactionCount: null });
    }
  }, [uid]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...stats, reload };
}
