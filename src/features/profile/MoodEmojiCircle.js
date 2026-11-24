// A mood's emoji in a circle of the mood's colour, from the Mood mockup.
import { StyleSheet, Text, View } from "react-native";

// Takes the mood (from USER_MOODS) and the circle's size in pixels.
export default function MoodEmojiCircle({ mood, size }) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: mood.ringColor,
        },
      ]}
    >
      <Text style={{ fontSize: Math.round(size * 0.55) }}>{mood.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
});
