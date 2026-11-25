// A list of post cards, 10 at a time, newest first. Used by the For You feed
// (all posts) and the Profile tab (one user's posts).
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EmptyState from "../../components/EmptyState";
import ErrorText from "../../components/ErrorText";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { useAuth } from "../auth/AuthContext";
import PostCard from "./PostCard";
import usePaginatedPosts from "./usePaginatedPosts";

// Shows "Try again" under an error message. Takes the function to call.
function RetryLink({ onPress }) {
  return (
    <Text style={styles.retry} onPress={onPress} accessibilityRole="button">
      Try again
    </Text>
  );
}

// Takes authorId (only that user's posts; null for all posts), postType
// (only that type; null for all types), the message shown when there are no
// posts, an optional header shown above the posts (for example the profile),
// an optional onListChanged, called after a refresh or a deleted post, and an
// optional authorProfile (profile pages), so the avatars show the author's
// current mood.
// Loads the next page near the end of the list, refreshes when pulled down,
// and refreshes when the page is opened again (for example after posting).
export default function PostList({
  authorId = null,
  postType = null,
  emptyMessage,
  header = null,
  onListChanged,
  authorProfile = null,
}) {
  const { user } = useAuth();
  const {
    posts,
    isLoading,
    isRefreshing,
    isLoadingMore,
    errorMessage,
    loadMore,
    refresh,
    retry,
    removePost,
  } = usePaginatedPosts(user?.uid ?? null, { authorId, postType });

  // Refreshes the list, then tells the page (for example to update counts).
  const refreshList = useCallback(async () => {
    await refresh();
    onListChanged?.();
  }, [refresh, onListChanged]);

  // Takes a deleted post off the list, then tells the page.
  const handlePostDeleted = useCallback(
    (postId) => {
      removePost(postId);
      onListChanged?.();
    },
    [removePost, onListChanged],
  );

  // Tabs stay open behind other pages, so the list refreshes each time it
  // comes back into view, but not the first time (the first page is loading
  // then). The ref keeps it from refreshing again when only the filter
  // changes (the hook already loads the new list then).
  const hasBeenFocusedRef = useRef(false);
  const refreshListRef = useRef(refreshList);
  refreshListRef.current = refreshList;
  useFocusEffect(
    useCallback(() => {
      if (hasBeenFocusedRef.current) refreshListRef.current();
      hasBeenFocusedRef.current = true;
    }, []),
  );

  // What shows when the list has no posts: the spinner, the error, or the
  // empty message.
  let emptyContent = <EmptyState message={emptyMessage} />;
  if (isLoading) {
    emptyContent = <LoadingSpinner />;
  } else if (errorMessage) {
    emptyContent = (
      <View style={styles.errorBox}>
        <ErrorText message={errorMessage} />
        <RetryLink onPress={retry} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.id}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          authorProfile={authorProfile}
          onDeleted={handlePostDeleted}
        />
      )}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshList}
          colors={[COLORS.purple]}
          tintColor={COLORS.purple}
        />
      }
      ListEmptyComponent={emptyContent}
      ListFooterComponent={
        posts.length > 0 && (
          <View style={styles.footer}>
            {isLoadingMore && <ActivityIndicator color={COLORS.purple} />}
            {errorMessage && (
              <>
                <ErrorText message={errorMessage} />
                <RetryLink onPress={loadMore} />
              </>
            )}
          </View>
        )
      }
      style={styles.list}
      contentContainerStyle={posts.length === 0 && styles.emptyContent}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.inputBackground },
  emptyContent: { flexGrow: 1 },
  separator: { height: 10, backgroundColor: COLORS.inputBackground },
  footer: { paddingVertical: 20, alignItems: "center" },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  retry: {
    marginTop: 12,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.purple,
  },
});
