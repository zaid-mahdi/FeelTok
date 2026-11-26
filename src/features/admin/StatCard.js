// One number card on the admin dashboard, from its mockup: a label, a big
// number and an icon in a tinted square.
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Takes the label, the number (null while loading), the icon and the icon's
// tint colour.
export default function StatCard({ label, value, icon, tintColor }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.iconBox, { backgroundColor: tintColor }]}>
          <Image source={icon} style={styles.icon} />
        </View>
      </View>
      <Text style={styles.value}>{value === null ? "–" : value.toLocaleString("en-GB")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: 18, borderRadius: 18, backgroundColor: COLORS.white },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontFamily: FONTS.medium, fontSize: 13, lineHeight: 18, color: COLORS.grey },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  icon: { width: 18, height: 18 },
  value: { marginTop: 10, fontFamily: FONTS.headingExtraBold, fontSize: 30, lineHeight: 38, color: COLORS.ink },
});
