// Create tab: tapping it opens the full-screen New post page instead (see the
// tab bar in _layout.js). This file only catches someone opening /create
// directly, for example by typing it in the browser.
import { Redirect } from "expo-router";

// Sends the user to the New post page.
export default function CreateScreen() {
  return <Redirect href="/new-post" />;
}
