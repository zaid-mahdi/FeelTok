// Layout of the admin sign-in page, from the designer's mockup: a dark brand
// panel on the left and a white card in the middle of the rest of the screen.
import { Image } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { POST_REACTIONS } from "../../constants/reactions";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Below this window width there is no room for the brand panel, so only the
// card is shown.
const MIN_WIDTH_FOR_PANEL = 900;

// Shows the brand panel (on wide windows) and the card with the page's
// content (children) in it.
export default function AdminAuthLayout({ children }) {
  const { width } = useWindowDimensions();
  const hasPanel = width >= MIN_WIDTH_FOR_PANEL;

  return (
    <View style={styles.screen}>
      {hasPanel && <BrandPanel />}
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.card}>{children}</View>
      </ScrollView>
    </View>
  );
}

// Shows the white logo with the ADMIN badge at the top, and the console's
// title, description and the Hi Six reaction tags at the bottom.
function BrandPanel() {
  return (
    <View style={styles.panel}>
      <View style={styles.logoRow}>
        <Image
          source={require("../../../assets/images/feeltok-logo-reversed.svg")}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="FeelTok"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ADMIN</Text>
        </View>
      </View>

      <View>
        <Text style={styles.heading}>Super Admin console</Text>
        <Text style={styles.description}>
          Monitor users, review activity and keep the FeelTok community a kind
          place to share.
        </Text>
        <View style={styles.tags}>
          {POST_REACTIONS.map((reaction) => (
            <View key={reaction.key} style={styles.tag}>
              <Text style={styles.tagText}>{reaction.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.inputBackground,
  },

  panel: {
    width: 440,
    padding: 64,
    justifyContent: "space-between",
    backgroundColor: COLORS.ink,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  // The logo SVG is 534 x 106, so we keep that ratio.
  logo: { width: 175, height: 175 * (106 / 534) },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.adminBadge,
  },
  badgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    color: COLORS.adminBadgeText,
  },
  heading: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.5,
    color: COLORS.white,
  },
  description: {
    marginTop: 24,
    maxWidth: 312,
    fontFamily: FONTS.regular,
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.panelText,
  },
  tags: {
    marginTop: 36,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    maxWidth: 260,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
  },
  tagText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.panelText,
  },

  main: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 464,
    padding: 44,
    paddingTop: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});
