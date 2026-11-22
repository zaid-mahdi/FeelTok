// Typography from the FeelTok design system (03 · Typography).
//   Headings:       Plus Jakarta Sans (ExtraBold 800, Bold 700, SemiBold 600)
//   Paragraph & UI: Inter (Regular 400, Medium 500, SemiBold 600)
//
// In React Native each weight of a custom font is its own font family,
// so use these names in `fontFamily` instead of setting `fontWeight`.
//
// We import each weight from its own sub-folder so only these six font
// files get bundled (importing from the package root pulls in all weights).
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans/800ExtraBold";

// Passed to useFonts() in app/_layout.js so the fonts load at startup.
export const fontAssets = {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
};

export const FONTS = {
  headingExtraBold: "PlusJakartaSans_800ExtraBold",
  headingBold: "PlusJakartaSans_700Bold",
  headingSemiBold: "PlusJakartaSans_600SemiBold",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
};
