// Home tab: the For You feed, open to everyone, even when logged out. The
// Friends switch only shows "Coming soon" (the Friends feed is out of scope).
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import PlaceholderPage from "../../src/components/PlaceholderPage";
import ForYouFeed from "../../src/features/posts/feed/ForYouFeed";
import HomeHeader from "../../src/features/posts/feed/HomeHeader";
import PostedMessage from "../../src/features/posts/feed/PostedMessage";
import { takeJustPosted } from "../../src/features/posts/postedNotice";
import { COLORS } from "../../src/theme/colors";

// Shows the header with the feed switch, and the chosen feed. Right after
// the user creates a post, it also shows the "Posted" message for a moment.
export default function HomeScreen() {
  const [selectedFeed, setSelectedFeed] = useState("forYou");
  const [isPostedMessageVisible, setIsPostedMessageVisible] = useState(false);

  // Each time Home comes into view, checks if a post was just saved.
  useFocusEffect(
    useCallback(() => {
      if (takeJustPosted()) setIsPostedMessageVisible(true);
    }, []),
  );

  // Hides the "Posted" message.
  const handleHidePostedMessage = useCallback(() => {
    setIsPostedMessageVisible(false);
  }, []);

  return (
    <View style={styles.screen}>
      <HomeHeader selectedFeed={selectedFeed} onSelectFeed={setSelectedFeed} />
      <View style={styles.content}>
        {selectedFeed === "forYou" ? (
          <ForYouFeed />
        ) : (
          <PlaceholderPage name="Friends feed" />
        )}
        <PostedMessage
          isVisible={isPostedMessageVisible}
          onHide={handleHidePostedMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.inputBackground },
  content: { flex: 1 },
});
