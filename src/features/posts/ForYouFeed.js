// The For You feed: every post, newest first, 10 at a time.
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

// Shows the list of post cards. Loads the next page near the end of the
// list, refreshes when pulled down, and refreshes when Home is opened again
// (for example after posting).
export default function ForYouFeed() {
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
  } = usePaginatedPosts(user?.uid ?? null);

  // Home stays open behind other pages, so it refreshes each time it comes
  // back into view, but not the first time (the first page is loading then).
  const hasBeenFocusedRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (hasBeenFocusedRef.current) refresh();
      hasBeenFocusedRef.current = true;
    }, [refresh]),
  );

  if (isLoading) return <LoadingSpinner />;

  if (errorMessage && posts.length === 0) {
    return (
      <View style={styles.errorBox}>
        <ErrorText message={errorMessage} />
        <Text style={styles.retry} onPress={retry} accessibilityRole="button">
          Try again
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.id}
      renderItem={({ item }) => <PostCard post={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={[COLORS.purple]}
          tintColor={COLORS.purple}
        />
      }
      ListEmptyComponent={<EmptyState message="No posts yet. Be the first!" />}
      ListFooterComponent={
        <View style={styles.footer}>
          {isLoadingMore && <ActivityIndicator color={COLORS.purple} />}
          {errorMessage && (
            <>
              <ErrorText message={errorMessage} />
              <Text
                style={styles.retry}
                onPress={loadMore}
                accessibilityRole="button"
              >
                Try again
              </Text>
            </>
          )}
        </View>
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
    backgroundColor: COLORS.inputBackground,
  },
  retry: {
    marginTop: 12,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.purple,
  },
});
