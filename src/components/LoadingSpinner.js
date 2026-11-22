// Shared loading screen.
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { COLORS } from "../theme/colors";

// Shows a spinner in the middle of the available space.
export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.purple} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
});
