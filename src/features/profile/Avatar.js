// A user's round avatar with a ring in the colour of their mood, and an
// optional emoji badge of that mood.
import { StyleSheet, Text, View } from "react-native";
import { findMood } from "../../constants/moods";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

const RING_WIDTH = 2;
const RING_GAP = 2;
// The mockups give each user one of these circle colours.
const AVATAR_COLORS = [COLORS.purple, COLORS.pink, COLORS.ink];

// Takes a name and returns its initials: "Emma Wilson" → "EW", "maya_k" →
// "MK", "zaid" → "Z".
export function getInitials(name) {
  const words = name.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return "";
  const initials =
    words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  return initials.toUpperCase();
}

// Takes a name and returns its circle colour. The same name always gets the
// same colour.
function getAvatarColor(name) {
  let total = 0;
  for (const character of name) total += character.charCodeAt(0);
  return AVATAR_COLORS[total % AVATAR_COLORS.length];
}

// Shows a coloured circle with the user's initials, inside a ring in the
// colour of the mood (no ring when there is no mood). Takes the name, the
// mood key (or null), the full size in pixels, and hasBadge to also show the
// mood's emoji in a small circle. Profile photos come in Task 11.
export default function Avatar({ name, moodKey, size = 48, hasBadge = false }) {
  const mood = findMood(moodKey);
  const innerSize = size - 2 * (RING_WIDTH + RING_GAP);
  const badgeSize = Math.round(size * 0.4);

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
      accessibilityLabel={
        mood ? `${name}'s avatar, feeling ${mood.key}` : `${name}'s avatar`
      }
    >
      <View
        style={[
          styles.circle,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: getAvatarColor(name),
          },
        ]}
      >
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.3) }]}>
          {getInitials(name)}
        </Text>
      </View>
      {hasBadge && mood && (
        <View
          style={[
            styles.badge,
            { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 },
          ]}
        >
          <Text style={{ fontSize: Math.round(badgeSize * 0.6) }}>
            {mood.emoji}
          </Text>
        </View>
      )}
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
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: FONTS.headingBold,
    color: COLORS.white,
  },
  badge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    boxShadow: "0 1px 3px rgba(20, 18, 42, 0.18)",
  },
});
