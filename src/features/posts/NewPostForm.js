// The New post page's form, from the designer's mockup: the author and mood,
// the post type, the text, the photo, and the bar with the Post button.
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { friendlyError } from "../../utils/errors";
import { pickPhoto, preparePostPhoto } from "../../utils/images";
import {
  countWords,
  MAX_POST_WORDS,
  validatePost,
} from "../../utils/validation";
import PostAuthorMood from "./PostAuthorMood";
import PostFormSection from "./PostFormSection";
import PostPhotoField from "./PostPhotoField";
import PostTextField from "./PostTextField";
import PostTypePicker from "./PostTypePicker";
import { createPost } from "./postService";

// Takes the logged-in user's profile and a function called after the post
// is saved. The mood starts on the user's current mood.
export default function NewPostForm({ profile, onPosted }) {
  const insets = useSafeAreaInsets();
  const [postType, setPostType] = useState(null);
  const [text, setText] = useState("");
  const [moodKey, setMoodKey] = useState(profile.mood ?? null);
  const [photo, setPhoto] = useState(null);
  const [isPreparingPhoto, setIsPreparingPhoto] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const wordCount = countWords(text);
  const isOverWordLimit = wordCount > MAX_POST_WORDS;
  const missingMessage = validatePost(text, postType);
  const canPost = !missingMessage && !isPreparingPhoto;

  // Lets the user pick and crop a photo, then makes it smaller for Firestore.
  async function handleAddPhotoPress() {
    setErrorMessage(null);
    try {
      const pickedPhoto = await pickPhoto();
      if (!pickedPhoto) return;
      setIsPreparingPhoto(true);
      setPhoto(await preparePostPhoto(pickedPhoto));
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setIsPreparingPhoto(false);
    }
  }

  // Takes the photo off the post.
  function handleRemovePhotoPress() {
    setPhoto(null);
  }

  // Saves the post, then tells the page it is done.
  async function handlePostPress() {
    if (!canPost) return;
    setErrorMessage(null);
    setIsPosting(true);
    try {
      await createPost({
        author: profile,
        text,
        postType,
        mood: moodKey,
        photoBase64: photo ? photo.base64 : null,
      });
      onPosted();
    } catch (error) {
      setErrorMessage(friendlyError(error));
      setIsPosting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <PostAuthorMood
          name={profile.displayName}
          uid={profile.uid}
          hasPhoto={profile.hasPhoto}
          profileMoodKey={profile.mood ?? null}
          moodKey={moodKey}
          onMoodChange={setMoodKey}
        />

        <PostFormSection title="Post type" note="Required">
          <PostTypePicker selectedKey={postType} onSelect={setPostType} />
        </PostFormSection>

        <PostFormSection
          title="Your post"
          note={`${wordCount} / ${MAX_POST_WORDS} words`}
          isNoteError={isOverWordLimit}
        >
          <PostTextField value={text} onChangeText={setText} />
          <Text style={styles.hint}>
            Required · up to {MAX_POST_WORDS} words
          </Text>
        </PostFormSection>

        <PostFormSection title="Photo" note="Optional · 1 photo">
          <PostPhotoField
            photo={photo}
            isPreparing={isPreparingPhoto}
            onAddPress={handleAddPhotoPress}
            onRemovePress={handleRemovePhotoPress}
          />
        </PostFormSection>
      </ScrollView>

      <View
        style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        {missingMessage && (
          <Text
            style={[styles.barHint, isOverWordLimit && styles.barHintError]}
          >
            {missingMessage}
          </Text>
        )}
        <ErrorText message={errorMessage} />
        <PrimaryButton
          title="Post"
          onPress={handlePostPress}
          isLoading={isPosting}
          isDisabled={!canPost}
          style={styles.postButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.inputBackground },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  hint: {
    marginTop: 8,
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
  bottomBar: {
    paddingTop: 14,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.white,
    boxShadow: "0 -4px 16px rgba(20, 18, 42, 0.06)",
  },
  barHint: {
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
  barHintError: { color: COLORS.error },
  postButton: { marginTop: 12 },
});
