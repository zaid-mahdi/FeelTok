// Hook for the friend list on the Friends page. The list is loaded when the
// page opens and when the user refreshes it; it doesn't update live.
import { useCallback, useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchFriends, removeFriend } from "./friendService";

// Takes the logged-in user's ID. Returns friends (a list, or null before the
// first load), isLoading, isRefreshing, errorMessage, refresh() to load again,
// and removeFriendById(friendshipId), which deletes a friendship and takes it
// off the list.
export default function useFriends(uid) {
  const [friends, setFriends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Loads the friends again. The spinner on top shows only when a list is
  // already on screen.
  const refresh = useCallback(async () => {
    if (!uid) return;
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      setFriends(await fetchFriends(uid));
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Deletes the friendship, then takes the friend off the list. Throws if
  // deleting fails, so the page can show the error.
  const removeFriendById = useCallback(async (friendshipId) => {
    await removeFriend(friendshipId);
    setFriends((oldFriends) =>
      oldFriends.filter((friend) => friend.friendshipId !== friendshipId),
    );
  }, []);

  return { friends, isLoading, isRefreshing, errorMessage, refresh, removeFriendById };
}
