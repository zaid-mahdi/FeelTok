// Asks the user to confirm something, on phones and in the browser.
import { Alert } from "react-native";
import { isWeb } from "./platform";

// Takes a question, a short explanation and the text of the confirm button
// (like "Delete"). Returns true if the user confirms. Phones show their own
// dialog; the browser uses its confirm box, because React Native's Alert
// doesn't work there.
export function confirmAction(title, message, confirmText) {
  if (isWeb) {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
      { text: confirmText, style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
