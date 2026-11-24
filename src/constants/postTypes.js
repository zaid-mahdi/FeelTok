// The 6 post types (the brand kit's "Hi Six"): what kind of post it is. Every
// post has exactly one. They are never used as user moods or reactions.
// If they change, update the matching list in firestore.rules too.
import { COLORS } from "../theme/colors";

export const POST_TYPES = [
  {
    key: "love",
    label: "Love",
    icon: require("../../assets/images/post-type-love.svg"),
    textColor: COLORS.pinkDeep,
    tintColor: COLORS.lightPink,
    borderColor: COLORS.pink,
  },
  {
    key: "gratitude",
    label: "Gratitude",
    icon: require("../../assets/images/post-type-gratitude.svg"),
    textColor: COLORS.purpleDeep,
    tintColor: COLORS.lightPurple,
    borderColor: COLORS.purple,
  },
  {
    key: "apology",
    label: "Apology",
    icon: require("../../assets/images/post-type-apology.svg"),
    textColor: COLORS.ink,
    tintColor: COLORS.inputBackground,
    borderColor: COLORS.ink,
  },
  {
    key: "appreciation",
    label: "Appreciation",
    icon: require("../../assets/images/post-type-appreciation.svg"),
    textColor: COLORS.pinkDeep,
    tintColor: COLORS.lightPink,
    borderColor: COLORS.pinkDeep,
  },
  {
    key: "mindfulness",
    label: "Mindfulness",
    icon: require("../../assets/images/post-type-mindfulness.svg"),
    textColor: COLORS.purpleDeep,
    tintColor: COLORS.lightPurple,
    borderColor: COLORS.purpleDeep,
  },
  {
    key: "thank_you",
    label: "Thank you",
    icon: require("../../assets/images/post-type-thank-you.svg"),
    textColor: COLORS.ink,
    tintColor: COLORS.inputBackground,
    borderColor: COLORS.grey,
  },
];
