// Opens a user's public profile page.
import { router } from "expo-router";

// Takes a user ID and opens their profile (your own goes to the Profile tab).
export function openUserProfile(uid) {
  router.push(`/user/${uid}`);
}
