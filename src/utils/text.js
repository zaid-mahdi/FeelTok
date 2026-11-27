// Small text helpers shared by many screens.

// Takes a count and a word ("comment") and returns "1 comment" or
// "3 comments".
export function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
