// Time helpers: show when something was posted, like the mockups ("2h",
// "Yesterday").
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Takes a Firestore timestamp (or null while it is being saved) and returns a
// short text: "Just now", "5m", "2h", "Yesterday", "3d", or a date like
// "12 Nov" for anything older than a week.
export function formatPostTime(timestamp) {
  if (!timestamp) return "Just now";
  const date = timestamp.toDate();
  const age = Date.now() - date.getTime();

  if (age < MINUTE) return "Just now";
  if (age < HOUR) return `${Math.floor(age / MINUTE)}m`;
  if (age < DAY) return `${Math.floor(age / HOUR)}h`;
  if (age < 2 * DAY) return "Yesterday";
  if (age < 7 * DAY) return `${Math.floor(age / DAY)}d`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
