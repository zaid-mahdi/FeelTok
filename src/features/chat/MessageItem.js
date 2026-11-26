// One message in the chat, from the chat mockup: my messages in purple
// bubbles on the right, my friend's in white bubbles on the left, the time
// under each, and a day label ("Today") above the first message of a day.
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatMessageDay, formatMessageTime } from "../../utils/time";

// Takes the message, isMine (sent by the logged-in user) and hasDayLabel
// (the first message of its day).
export default function MessageItem({ message, isMine, hasDayLabel }) {
  return (
    <View>
      {hasDayLabel && (
        <View style={styles.dayLabel}>
          <Text style={styles.dayText}>{formatMessageDay(message.createdAt)}</Text>
        </View>
      )}
      <View style={[styles.message, isMine ? styles.mine : styles.theirs]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.text, isMine && styles.textMine]}>{message.text}</Text>
        </View>
        <Text style={styles.time}>{formatMessageTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dayLabel: {
    alignSelf: "center",
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  dayText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
  message: { maxWidth: "80%", marginBottom: 10 },
  mine: { alignSelf: "flex-end", alignItems: "flex-end" },
  theirs: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine: { backgroundColor: COLORS.purple, borderBottomRightRadius: 6 },
  bubbleTheirs: { backgroundColor: COLORS.white, borderBottomLeftRadius: 6 },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.ink,
  },
  textMine: { color: COLORS.white },
  time: {
    marginTop: 3,
    marginHorizontal: 4,
    fontFamily: FONTS.medium,
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.grey,
  },
});
