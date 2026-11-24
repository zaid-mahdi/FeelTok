// One section of the New post page: a heading, a small note on the right and
// the section's content.
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

// Shows the title (like "Post type"), the note (like "Required", in red when
// isNoteError is true) and the children below them.
export default function PostFormSection({
  title,
  note,
  isNoteError = false,
  children,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={[styles.note, isNoteError && styles.noteError]}>
          {note}
        </Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.ink,
  },
  note: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.grey,
  },
  noteError: { color: COLORS.error },
});
