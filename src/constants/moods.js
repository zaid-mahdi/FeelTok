// The 6 user moods: how a user is feeling. Shown on profiles and avatars,
// saved on a post as the author's mood, and also used to react to posts.
// If they change, update the matching list in firestore.rules too.
import { COLORS } from "../theme/colors";

export const USER_MOODS = [
  {
    key: "happy",
    label: "Happy",
    emoji: "😊",
    ringColor: COLORS.moodHappyRing,
    tintColor: COLORS.moodHappyTint,
  },
  {
    key: "sad",
    label: "Sad",
    emoji: "😢",
    ringColor: COLORS.moodSadRing,
    tintColor: COLORS.moodSadTint,
  },
  {
    key: "angry",
    label: "Angry",
    emoji: "😠",
    ringColor: COLORS.moodAngryRing,
    tintColor: COLORS.moodAngryTint,
  },
  {
    key: "love",
    label: "Love",
    emoji: "❤️",
    ringColor: COLORS.moodLoveRing,
    tintColor: COLORS.moodLoveTint,
  },
  {
    key: "surprised",
    label: "Surprised",
    emoji: "😮",
    ringColor: COLORS.moodSurprisedRing,
    tintColor: COLORS.moodSurprisedTint,
  },
  {
    key: "funny",
    label: "Funny",
    emoji: "😂",
    ringColor: COLORS.moodFunnyRing,
    tintColor: COLORS.moodFunnyTint,
  },
];

// Takes a mood key and returns its mood from the list, or null if there is
// no mood with that key.
export function findMood(moodKey) {
  return USER_MOODS.find((mood) => mood.key === moodKey) ?? null;
}
