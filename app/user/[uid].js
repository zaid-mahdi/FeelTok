// Public profile page (Task 12): someone else's profile and posts, read-only,
// with the same design as the Profile tab. Anyone can open it, also when
// logged out. Your own profile goes to the Profile tab.
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../../src/components/BackButton";
import EmptyState from "../../src/components/EmptyState";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { POST_TYPES } from "../../src/constants/postTypes";
import { useAuth } from "../../src/features/auth/AuthContext";
import PostList from "../../src/features/posts/PostList";
import ProfileHeader from "../../src/features/profile/ProfileHeader";
import useProfileStats from "../../src/features/profile/useProfileStats";
import useUserProfile from "../../src/features/profile/useUserProfile";
import { COLORS } from "../../src/theme/colors";

// Goes back to the page before, or to Home when the profile was opened
// directly.
function handleBackPress() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

// Returns the message for an empty list: for all posts, or for one type.
function getEmptyMessage(username, postTypeKey) {
  const postType = POST_TYPES.find((type) => type.key === postTypeKey);
  if (!postType) return `@${username} hasn't posted anything yet.`;
  return `@${username} has no ${postType.label} posts yet.`;
}

// Shows a back button above a loading, error or "not found" message.
function MessagePage({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.messagePage, { paddingTop: insets.top + 12 }]}>
      <BackButton onPress={handleBackPress} />
      <View style={styles.message}>{children}</View>
    </View>
  );
}

// Shows the profile of the user in the address (user/[uid]).
export default function UserProfileScreen() {
  const { uid } = useLocalSearchParams();
  const { user } = useAuth();
  const isOwnProfile = Boolean(user) && user.uid === uid;
  const { profile, isLoading, errorMessage } = useUserProfile(uid);
  const stats = useProfileStats(isOwnProfile ? null : uid);
  const [selectedPostType, setSelectedPostType] = useState(null);

  if (isOwnProfile) return <Redirect href="/profile" />;
  if (isLoading) {
    return (
      <MessagePage>
        <LoadingSpinner />
      </MessagePage>
    );
  }
  if (errorMessage) {
    return (
      <MessagePage>
        <ErrorText message={errorMessage} />
      </MessagePage>
    );
  }
  if (!profile) {
    return (
      <MessagePage>
        <EmptyState message="This user doesn't exist." />
      </MessagePage>
    );
  }

  return (
    <View style={styles.page}>
      <PostList
        authorId={uid}
        postType={selectedPostType}
        emptyMessage={getEmptyMessage(profile.username, selectedPostType)}
        onListChanged={stats.reload}
        authorProfile={profile}
        header={
          <ProfileHeader
            profile={profile}
            isOwnProfile={false}
            onBackPress={handleBackPress}
            stats={stats}
            selectedPostType={selectedPostType}
            onSelectPostType={setSelectedPostType}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
  messagePage: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  message: { flex: 1, alignItems: "center", justifyContent: "center" },
});
