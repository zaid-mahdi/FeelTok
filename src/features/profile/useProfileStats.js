// Hook for the numbers on a profile: posts, reactions and (on your own
// profile only) friends.
import { useCallback, useEffect, useState } from "react";
import { countFriends } from "../friends/friendService";
import { fetchAuthorStats } from "../posts/postService";

// Takes a user ID and hasFriendCount (true only on your own profile, because
// only the two friends can read a friendship). Returns postCount,
// reactionCount and friendCount (null while loading or if they couldn't be
// loaded; friendCount is undefined without hasFriendCount) and reload, to
// count again (for example after a post is deleted).
export default function useProfileStats(uid, { hasFriendCount = false } = {}) {
  const [stats, setStats] = useState({
    postCount: null,
    reactionCount: null,
    friendCount: hasFriendCount ? null : undefined,
  });

  // Asks Firestore for the numbers again.
  const reload = useCallback(async () => {
    if (!uid) return;
    try {
      const [authorStats, friendCount] = await Promise.all([
        fetchAuthorStats(uid),
        hasFriendCount ? countFriends(uid) : undefined,
      ]);
      setStats({ ...authorStats, friendCount });
    } catch (error) {
      // Shown in the Expo terminal, so a missing index or rule can be found.
      console.warn("Could not load the profile numbers:", error);
      setStats({
        postCount: null,
        reactionCount: null,
        friendCount: hasFriendCount ? null : undefined,
      });
    }
  }, [uid, hasFriendCount]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...stats, reload };
}
