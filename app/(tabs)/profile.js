// Profile tab, from the profile mockup: my profile above my posts, which can
// be filtered by post type, with the Edit profile and Account settings
// pop-ups.
import { Redirect } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ErrorText from "../../src/components/ErrorText";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { POST_TYPES } from "../../src/constants/postTypes";
import { useAuth } from "../../src/features/auth/AuthContext";
import PostList from "../../src/features/posts/PostList";
import AccountSettingsModal from "../../src/features/profile/AccountSettingsModal";
import EditProfileModal from "../../src/features/profile/EditProfileModal";
import ProfileHeader from "../../src/features/profile/ProfileHeader";
import useProfileStats from "../../src/features/profile/useProfileStats";
import { COLORS } from "../../src/theme/colors";
import { friendlyError } from "../../src/utils/errors";

// Returns the message for an empty list: for all posts, or for one type.
function getEmptyMessage(postTypeKey) {
  const postType = POST_TYPES.find((type) => type.key === postTypeKey);
  if (!postType) return "You haven't posted anything yet.";
  return `You have no ${postType.label} posts yet.`;
}

// Shows the profile and my posts. Without a login (for example right after
// logging out) it goes to Home.
export default function ProfileScreen() {
  const { user, profile, profileError } = useAuth();
  const stats = useProfileStats(user?.uid ?? null, { hasFriendCount: true });
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return <Redirect href="/" />;
  if (profileError) return <ErrorText message={friendlyError(profileError)} />;
  if (!profile) return <LoadingSpinner />;

  return (
    <View style={styles.page}>
      <PostList
        authorId={user.uid}
        postType={selectedPostType}
        emptyMessage={getEmptyMessage(selectedPostType)}
        onListChanged={stats.reload}
        authorProfile={profile}
        header={
          <ProfileHeader
            profile={profile}
            stats={stats}
            selectedPostType={selectedPostType}
            onSelectPostType={setSelectedPostType}
            onEditProfilePress={() => setIsEditProfileOpen(true)}
            onSettingsPress={() => setIsSettingsOpen(true)}
          />
        }
      />
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}
      {isSettingsOpen && (
        <AccountSettingsModal
          profile={profile}
          email={user.email}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.inputBackground },
});
