// Hook for a post's comments, with each commenter's current mood.
import { useCallback, useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchProfiles } from "../profile/profileService";
import { addComment, deleteComment, fetchComments } from "./commentService";

// Takes a post ID. Loads its comments (oldest first) and the profiles of the
// people who wrote them, so their avatars can show their current mood.
// Returns the comments, the profiles (user ID → profile), the loading state,
// an error message (or null), and functions to add and delete comments.
export default function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Loads the comments and their authors' profiles again.
  const reload = useCallback(async () => {
    setErrorMessage(null);
    try {
      const loadedComments = await fetchComments(postId);
      const profiles = await fetchProfiles(
        loadedComments.map((comment) => comment.authorId),
      );
      setComments(loadedComments);
      setProfilesById(profiles);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Saves a new comment by the logged-in user (author is their profile) and
  // adds it to the end of the list. Throws if saving fails.
  const add = useCallback(
    async (author, text) => {
      const comment = await addComment(postId, author, text);
      setComments((current) => [...current, comment]);
      setProfilesById((current) => ({ ...current, [author.uid]: author }));
    },
    [postId],
  );

  // Deletes one of the user's own comments and takes it off the list. Throws
  // if deleting fails.
  const remove = useCallback(
    async (commentId) => {
      await deleteComment(postId, commentId);
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );
    },
    [postId],
  );

  return { comments, profilesById, isLoading, errorMessage, add, remove, reload };
}
