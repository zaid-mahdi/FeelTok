// A small rounded tag with a post's type (like "Gratitude"), shown on post
// cards.
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { POST_TYPES } from "../../../constants/postTypes";
import { FONTS } from "../../../theme/fonts";

// Takes the post type key and shows its icon and label in its tint colour.
// Shows nothing for an unknown key.
export default function PostTypeTag({ postTypeKey }) {
  const postType = POST_TYPES.find((type) => type.key === postTypeKey);
  if (!postType) return null;

  return (
    <View style={[styles.tag, { backgroundColor: postType.tintColor }]}>
      <Image source={postType.icon} style={styles.icon} />
      <Text style={[styles.label, { color: postType.textColor }]}>
        {postType.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  icon: { width: 13, height: 13, marginRight: 5 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
});
