// The one place that decides which platform the app runs on. The admin
// dashboard is web only; the user app works on phones and on the web.
import { Platform } from "react-native";

// True in a web browser, false in the mobile app.
export const isWeb = Platform.OS === "web";
