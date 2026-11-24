// The row of post type chips above "My posts", from the profile mockup:
// All, then the 6 post types. Picking one shows only that type.
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { POST_TYPES } from "../../constants/postTypes";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows one chip, with a purple look when it is the picked one.
function FilterChip({ label, icon, isSelected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      role="radio"
      aria-checked={isSelected}
      accessibilityLabel={`Show ${label}`}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

// Takes the picked post type key (null for All) and a function called with
// the new key (or null). Scrolls sideways.
export default function PostTypeFilter({ selectedPostType, onSelectPostType }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      role="radiogroup"
    >
      <FilterChip
        label="All"
        isSelected={selectedPostType === null}
        onPress={() => onSelectPostType(null)}
      />
      {POST_TYPES.map((postType) => (
        <FilterChip
          key={postType.key}
          label={postType.label}
          icon={postType.icon}
          isSelected={selectedPostType === postType.key}
          onPress={() => onSelectPostType(postType.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingHorizontal: 20 },
  chip: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipSelected: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
  },
  icon: { width: 15, height: 15, marginRight: 6 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.ink,
  },
  labelSelected: { color: COLORS.purpleDeep },
});
