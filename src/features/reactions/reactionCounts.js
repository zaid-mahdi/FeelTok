// Works out a post's reaction counts after a user's reaction changes. Used to
// update the screen straight away, before Firestore answers.
import { USER_MOODS } from "../../constants/moods";

// Takes the current counts (one number per mood), the user's old reaction
// and their new one (mood keys, or null for none). Returns new counts with
// 1 taken from the old mood and 1 added to the new mood.
export function applyReactionChange(reactionCounts, oldMoodKey, newMoodKey) {
  const counts = {};
  for (const mood of USER_MOODS) counts[mood.key] = reactionCounts?.[mood.key] ?? 0;
  if (oldMoodKey) counts[oldMoodKey] = Math.max(0, counts[oldMoodKey] - 1);
  if (newMoodKey) counts[newMoodKey] += 1;
  return counts;
}

// Takes a post's reaction counts and returns the total number of reactions.
export function getTotalReactions(reactionCounts) {
  return Object.values(reactionCounts ?? {}).reduce((sum, count) => sum + count, 0);
}
