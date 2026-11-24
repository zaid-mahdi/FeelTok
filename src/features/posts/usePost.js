// Hook for the post page: loads one post and the user's reaction to it.
import { useEffect, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { useAuth } from "../auth/AuthContext";
import { fetchMyReactions } from "../reactions/reactionService";
import { fetchPost } from "./postService";

// Takes a post ID. Returns the post (with myReaction, or null when the post
// doesn't exist), isLoading, and an error message (or null).
export default function usePost(postId) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    // Loads the post, then the user's reaction to it when logged in.
    async function loadPost() {
      try {
        const loadedPost = await fetchPost(postId);
        if (loadedPost && uid) {
          const myReactions = await fetchMyReactions([postId], uid);
          loadedPost.myReaction = myReactions[postId] ?? null;
        }
        if (isCurrent) setPost(loadedPost);
      } catch (error) {
        if (isCurrent) setErrorMessage(friendlyError(error));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPost();
    return () => {
      isCurrent = false;
    };
  }, [postId, uid]);

  return { post, isLoading, errorMessage };
}
