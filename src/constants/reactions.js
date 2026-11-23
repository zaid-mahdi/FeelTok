// The 6 post reactions (the brand kit's "Hi Six"): how a user reacts to a
// post. Only used on posts, never as user moods.
// If they change, update the matching list in firestore.rules too.
export const POST_REACTIONS = [
  { key: "love", label: "Love" },
  { key: "gratitude", label: "Gratitude" },
  { key: "apology", label: "Apology" },
  { key: "appreciation", label: "Appreciation" },
  { key: "mindfulness", label: "Mindfulness" },
  { key: "thank_you", label: "Thank you" },
];
