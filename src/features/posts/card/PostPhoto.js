// The photo of a post card. Photos are in their own documents, so each card
// loads its own photo.
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { fetchPostPhoto } from "../postService";

// Photos already loaded, by post ID, so scrolling back up or refreshing
// doesn't download them again.
const loadedPhotos = new Map();

// The photo keeps its own shape, but very tall or very wide photos are
// cropped to these limits (width divided by height).
const MIN_ASPECT_RATIO = 0.8;
const MAX_ASPECT_RATIO = 1.9;
const DEFAULT_ASPECT_RATIO = 1.7;

// Takes the post ID and shows its photo across the full card width. Shows a
// light box while loading, and a message if the photo can't be loaded.
export default function PostPhoto({ postId }) {
  const [photoUri, setPhotoUri] = useState(loadedPhotos.get(postId) ?? null);
  const [hasFailed, setHasFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);

  useEffect(() => {
    if (loadedPhotos.has(postId)) return;
    let isCurrent = true;
    fetchPostPhoto(postId)
      .then((uri) => {
        if (!uri) throw new Error("No photo");
        loadedPhotos.set(postId, uri);
        if (isCurrent) setPhotoUri(uri);
      })
      .catch(() => {
        if (isCurrent) setHasFailed(true);
      });
    return () => {
      isCurrent = false;
    };
  }, [postId]);

  // Uses the photo's real shape once it is loaded, within the limits.
  function handleLoad(event) {
    const { width, height } = event.source;
    if (!width || !height) return;
    const ratio = width / height;
    setAspectRatio(Math.min(MAX_ASPECT_RATIO, Math.max(MIN_ASPECT_RATIO, ratio)));
  }

  if (hasFailed) {
    return (
      <View style={[styles.box, styles.failedBox]}>
        <Text style={styles.failedText}>This photo couldn't be loaded.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.box, { aspectRatio }]}>
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          contentFit="cover"
          onLoad={handleLoad}
          accessibilityLabel="Photo in the post"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: "100%", backgroundColor: COLORS.lightPurple },
  photo: { width: "100%", height: "100%" },
  failedBox: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  failedText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
});
