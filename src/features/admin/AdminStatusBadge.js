// The "Active" (green) or "Blocked" (red) badge, from the admin mockups.
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes isBlocked.
export default function AdminStatusBadge({ isBlocked }) {
  return (
    <Text style={[styles.badge, isBlocked ? styles.blocked : styles.active]}>
      {isBlocked ? "Blocked" : "Active"}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    lineHeight: 16,
  },
  active: { color: COLORS.success, backgroundColor: COLORS.successTint },
  blocked: { color: COLORS.error, backgroundColor: COLORS.lightPink },
});
