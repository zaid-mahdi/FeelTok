// Temporary page, used until the designer finishes the real one.
import { StyleSheet, Text, View } from "react-native";

// Shows the page name and "Coming soon". Takes the name, and optional
// children for the plain controls needed to test a task.
export default function PlaceholderPage({ name, children }) {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      <Text>Coming soon</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
