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

// Takes a count and a unit ("minute") and returns "1 minute" or "5 minutes".
function pluralize(count, unit) {
  return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

// Takes a Firestore timestamp (or null while it is being saved) and returns a
// text to follow "Updated" on the Mood tab: "just now", "5 minutes ago",
// "2 hours ago", "yesterday", "3 days ago", or "on 12 Nov".
export function formatTimeAgo(timestamp) {
  if (!timestamp) return "just now";
  const date = timestamp.toDate();
  const age = Date.now() - date.getTime();

  if (age < MINUTE) return "just now";
  if (age < HOUR) return `${pluralize(Math.floor(age / MINUTE), "minute")} ago`;
  if (age < DAY) return `${pluralize(Math.floor(age / HOUR), "hour")} ago`;
  if (age < 2 * DAY) return "yesterday";
  if (age < 7 * DAY) return `${pluralize(Math.floor(age / DAY), "day")} ago`;
  return `on ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

// Takes a Firestore timestamp and returns the short text after a friend's
// mood on the Friends page: "now", "10m", "2h", "yesterday", "3d", or a date
// like "12 Nov".
export function formatShortTimeAgo(timestamp) {
  const postTime = formatPostTime(timestamp);
  if (postTime === "Just now") return "now";
  if (postTime === "Yesterday") return "yesterday";
  return postTime;
}

// Takes a Firestore timestamp (or null while it is being saved) and returns
// the time under a chat message, like "9:12" or "14:05".
export function formatMessageTime(timestamp) {
  const date = timestamp ? timestamp.toDate() : new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Takes a Firestore timestamp (or null) and returns the day label in a chat:
// "Today", "Yesterday", or a date like "12 Nov".
export function formatMessageDay(timestamp) {
  const date = timestamp ? timestamp.toDate() : new Date();
  const today = new Date();
  const yesterday = new Date(today.getTime() - DAY);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Takes two Firestore timestamps (either can be null) and returns true if
// they are on the same day.
export function isSameDay(timestampA, timestampB) {
  const dateA = timestampA ? timestampA.toDate() : new Date();
  const dateB = timestampB ? timestampB.toDate() : new Date();
  return dateA.toDateString() === dateB.toDateString();
}
