// The top of Home, from the For You feed mockup: the logo and the switch
// between the For You and Friends feeds.
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";

const FEEDS = [
  { key: "forYou", label: "For You" },
  { key: "friends", label: "Friends" },
];

// Takes the open feed ("forYou" or "friends") and a function called with the
// feed the user taps.
export default function HomeHeader({ selectedFeed, onSelectFeed }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Image
        source={require("../../../../assets/images/feeltok-logo.svg")}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="FeelTok"
      />
      <View style={styles.switch} role="tablist">
        {FEEDS.map((feed) => {
          const isSelected = feed.key === selectedFeed;
          return (
            <Pressable
              key={feed.key}
              onPress={() => onSelectFeed(feed.key)}
              role="tab"
              aria-selected={isSelected}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {feed.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    boxShadow: "0 4px 12px rgba(20, 18, 42, 0.05)",
    zIndex: 1,
  },
  logo: { width: 123, height: 123 * (106 / 534) },
  switch: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
  },
  option: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    justifyContent: "center",
  },
  optionSelected: { backgroundColor: COLORS.purple },
  optionText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.grey,
  },
  optionTextSelected: { color: COLORS.white },
});
