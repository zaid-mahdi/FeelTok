// The photo part of the New post page: "Add a photo", or the picked photo
// with a remove (✕) button.
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the photo ({ uri, width, height }) or null, isPreparing (true while
// the photo is being made smaller), and the functions for adding and removing.
export default function PostPhotoField({
  photo,
  isPreparing,
  onAddPress,
  onRemovePress,
}) {
  if (isPreparing) {
    return (
      <View style={styles.addBox}>
        <ActivityIndicator color={COLORS.purple} />
        <Text style={styles.preparingText}>Preparing photo…</Text>
      </View>
    );
  }

  if (photo) {
    return (
      <View>
        <Image
          source={{ uri: photo.uri }}
          style={[styles.preview, { aspectRatio: photo.width / photo.height }]}
          contentFit="cover"
          accessibilityLabel="The photo for your post"
        />
        <Pressable
          onPress={onRemovePress}
          accessibilityRole="button"
          accessibilityLabel="Remove photo"
          style={styles.removeButton}
        >
          <Image
            source={require("../../../assets/images/icon-close-white.svg")}
            style={styles.removeIcon}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onAddPress}
      accessibilityRole="button"
      accessibilityLabel="Add a photo"
      style={({ pressed }) => [styles.addBox, pressed && styles.addBoxPressed]}
    >
      <Image
        source={require("../../../assets/images/icon-photo.svg")}
        style={styles.addIcon}
      />
      <Text style={styles.addText}>Add a photo</Text>
      <Text style={styles.addHint}>JPG or PNG, up to 10 MB</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addBox: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.photoBorder,
    backgroundColor: COLORS.white,
  },
  addBoxPressed: { backgroundColor: COLORS.lightPurple },
  addIcon: { width: 20, height: 20 },
  addText: {
    marginLeft: 10,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.purple,
  },
  addHint: {
    marginLeft: 10,
    fontFamily: FONTS.medium,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.grey,
  },
  preparingText: {
    marginLeft: 10,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  preview: {
    width: "100%",
    maxHeight: 420,
    borderRadius: 14,
    backgroundColor: COLORS.border,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(20, 18, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: { width: 16, height: 16 },
});
