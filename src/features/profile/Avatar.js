// A user's round avatar with a ring in the colour of their current mood.
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

const RING_WIDTH = 2;
const RING_GAP = 2;

// Takes a name and returns its initials: "Emma Wilson" → "EW", "maya_k" →
// "MK", "zaid" → "Z".
export function getInitials(name) {
  const words = name.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return "";
  const initials =
    words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  return initials.toUpperCase();
}

// Shows a purple circle with the user's initials, inside a ring in the colour
// of their mood (no ring when they have no mood). Takes the name, the mood key
// (or null) and the full size in pixels. Profile photos come in Task 11.
export default function Avatar({ name, moodKey, size = 48 }) {
  const mood = findMood(moodKey);
  const innerSize = size - 2 * (RING_WIDTH + RING_GAP);

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: mood ? mood.ringColor : "transparent",
        },
      ]}
      accessibilityLabel={`${name}'s avatar`}
    >
      <View
        style={[
          styles.circle,
          { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        ]}
      >
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.3) }]}>
          {getInitials(name)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: RING_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: FONTS.headingBold,
    color: COLORS.white,
  },
});
