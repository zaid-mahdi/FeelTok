// Hook for lists of posts (the For You feed, profiles): loads posts page by
// page.
import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchMyReactions } from "../reactions/reactionService";
import { fetchPostsPage } from "./postService";

// Loads one page of posts (see fetchPostsPage for the filters). When uid is
// given, each post also gets myReaction: that user's reaction to it, or null.
async function fetchPageWithMyReactions(afterSnapshot, uid, filters) {
  const page = await fetchPostsPage(afterSnapshot, filters);
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

// Takes the logged-in user's ID (or null) and optional filters: authorId
// (only that user's posts) and postType (only that type). Loads the first
// page when it starts and again when the filters change. Returns the posts
// loaded so far, the loading states, an error message (or null), and four
// functions: loadMore (next page, at the end of the list), refresh (pull to
// refresh), retry (after an error on the first page) and removePost (takes a
// deleted post off the list).
export default function usePaginatedPosts(
  uid,
  { authorId = null, postType = null } = {},
) {
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
  // Counts first-page loads, so an older answer (for example for the filter
  // the user just left) never replaces a newer one.
  const loadNumberRef = useRef(0);

  // Loads the first page again and replaces the list with it.
  const loadFirstPage = useCallback(async () => {
    const loadNumber = ++loadNumberRef.current;
    isBusyRef.current = true;
    setErrorMessage(null);
    try {
      const page = await fetchPageWithMyReactions(null, uid, {
        authorId,
        postType,
      });
      if (loadNumber !== loadNumberRef.current) return;
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts(page.posts);
      setHasMore(page.hasMore);
    } catch (error) {
      if (loadNumber === loadNumberRef.current) {
        setErrorMessage(friendlyError(error));
      }
    } finally {
      if (loadNumber === loadNumberRef.current) isBusyRef.current = false;
    }
  }, [uid, authorId, postType]);

  // Starts with an empty list and the spinner, also when the filters change.
  useEffect(() => {
    let isCurrent = true;
    setPosts([]);
    setIsLoading(true);
    loadFirstPage().finally(() => {
      if (isCurrent) setIsLoading(false);
    });
    return () => {
      isCurrent = false;
    };
  }, [loadFirstPage]);

  // Adds the next page to the end of the list, if there is one.
  const loadMore = useCallback(async () => {
    if (isBusyRef.current || !hasMore || !lastSnapshotRef.current) return;
    isBusyRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage(null);
    try {
      const page = await fetchPageWithMyReactions(lastSnapshotRef.current, uid, {
        authorId,
        postType,
      });
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts((currentPosts) => [...currentPosts, ...page.posts]);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      isBusyRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, uid, authorId, postType]);

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
