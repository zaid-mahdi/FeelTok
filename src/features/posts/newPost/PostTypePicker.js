// The 6 post types on the New post page, in two columns. One must be picked.
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { POST_TYPES } from "../../../constants/postTypes";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";

// Takes the picked post type key (or null) and a function called with the
// key of the type the user taps. The picked one gets its tint and border.
export default function PostTypePicker({ selectedKey, onSelect }) {
  return (
    <View style={styles.grid} role="radiogroup" aria-label="Post type">
      {POST_TYPES.map((postType) => {
        const isSelected = postType.key === selectedKey;
        return (
          <Pressable
            key={postType.key}
            onPress={() => onSelect(postType.key)}
            role="radio"
            aria-checked={isSelected}
            accessibilityLabel={postType.label}
            style={[
              styles.option,
              isSelected && {
                backgroundColor: postType.tintColor,
                borderColor: postType.borderColor,
              },
            ]}
          >
            <Image source={postType.icon} style={styles.icon} />
            <Text style={[styles.label, { color: postType.textColor }]}>
              {postType.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 11,
  },
  option: {
    width: "48.5%",
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  icon: { width: 17, height: 17, marginRight: 9 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
