// Label and input styles shared by the login and forgot password forms.
import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export const authFormStyles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink,
    marginBottom: 8,
  },
  inputBox: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 16,
  },
  inputText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.ink,
  },
});
