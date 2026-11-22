// Shared message for screens and lists that have nothing to show.
import { StyleSheet, Text, View } from "react-native";

// Shows a message in the middle of the available space. Takes the message.
export default function EmptyState({ message }) {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
