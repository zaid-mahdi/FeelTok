// Hook for the For You feed: loads posts page by page.
import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../utils/errors";
import { fetchPostsPage } from "./postService";

// Loads the first page when it starts. Returns the posts loaded so far, the
// loading states, an error message (or null), and three functions: loadMore
// (next page, at the end of the list), refresh (pull to refresh, starts
// again from the newest post) and retry (after an error on the first page).
export default function usePaginatedPosts() {
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
      const page = await fetchPostsPage(null);
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts(page.posts);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      isBusyRef.current = false;
    }
  }, []);

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
      const page = await fetchPostsPage(lastSnapshotRef.current);
      lastSnapshotRef.current = page.lastSnapshot;
      setPosts((currentPosts) => [...currentPosts, ...page.posts]);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      isBusyRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore]);

  // Pull to refresh: loads the newest posts again.
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadFirstPage();
    setIsRefreshing(false);
  }, [loadFirstPage]);

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
  };
}
