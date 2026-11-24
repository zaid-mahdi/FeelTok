// Hook for the For You feed: loads posts page by page.
import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchMyReactions } from "../reactions/reactionService";
import { fetchPostsPage } from "./postService";

// Loads one page of posts (see fetchPostsPage). When uid is given, each post
// also gets myReaction: that user's reaction to it, or null.
async function fetchPageWithMyReactions(afterSnapshot, uid) {
  const page = await fetchPostsPage(afterSnapshot);
  if (!uid) return page;
  const myReactions = await fetchMyReactions(
    page.posts.map((post) => post.id),
    uid,
  );
  return {
    ...page,
    posts: page.posts.map((post) => ({
      ...post,
      myReaction: myReactions[post.id] ?? null,
    })),
  };
}

// Takes the logged-in user's ID (or null). Loads the first page when it
// starts. Returns the posts loaded so far, the loading states, an error
// message (or null), and four functions: loadMore (next page, at the end of
// the list), refresh (pull to refresh, starts again from the newest post),
// retry (after an error on the first page) and removePost (takes a deleted
// post off the list).
export default function usePaginatedPosts(uid) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Kept outside state so a page that is still loading is never asked for
  // twice (the list can call loadMore many times while scrolling).
  const lastSnapshotRef = useRef(null);
  const isBusyRef = useRef(false);

  // Loads the first page again and replaces the list with it.
  const loadFirstPage = useCallback(async () => {
    isBusyRef.current = true;
    setErrorMessage(null);
    try {
      const page = await fetchPageWithMyReactions(null, uid);
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts(page.posts);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      isBusyRef.current = false;
    }
  }, [uid]);

  useEffect(() => {
    loadFirstPage().finally(() => setIsLoading(false));
  }, [loadFirstPage]);

  // Adds the next page to the end of the list, if there is one.
  const loadMore = useCallback(async () => {
    if (isBusyRef.current || !hasMore || !lastSnapshotRef.current) return;
    isBusyRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage(null);
    try {
      const page = await fetchPageWithMyReactions(lastSnapshotRef.current, uid);
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts((currentPosts) => [...currentPosts, ...page.posts]);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      isBusyRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, uid]);

  // Pull to refresh: loads the newest posts again.
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadFirstPage();
    setIsRefreshing(false);
  }, [loadFirstPage]);

  // Takes a deleted post off the list.
  const removePost = useCallback((postId) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  }, []);

  // Tries the first page again after an error, with the full-screen spinner.
  const retry = useCallback(async () => {
    setIsLoading(true);
    await loadFirstPage();
    setIsLoading(false);
  }, [loadFirstPage]);

  return {
    posts,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    errorMessage,
    loadMore,
    refresh,
    retry,
    removePost,
  };
}
