// The 6 user moods: how a user is feeling. Shown on profiles and avatars, and
// saved on a post as the author's mood. Never used as post reactions.
// If they change, update the matching list in firestore.rules too.
export const USER_MOODS = [
  { key: "happy", emoji: "😊" },
  { key: "sad", emoji: "😢" },
  { key: "angry", emoji: "😠" },
  { key: "love", emoji: "❤️" },
  { key: "surprised", emoji: "😮" },
  { key: "funny", emoji: "😂" },
];
