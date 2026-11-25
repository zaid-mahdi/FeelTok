// Shared pop-up card, from the profile mockups (Edit profile, Account
// settings): a white card over the dimmed page, with a title and a ✕ button.
// It can also be a sheet at the bottom of the screen (Invite a friend).
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import CloseButton from "./CloseButton";

// Takes isVisible, the title, a function called to close it (✕, tapping the
// dimmed page, or the phone's back button) and the content as children.
// isSheet shows it at the bottom of the screen, with a small handle on top.
export default function AppModal({
  isVisible,
  title,
  onClose,
  isSheet = false,
  children,
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.page, isSheet && styles.pageSheet]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
        />
        <View
          style={[
            styles.card,
            isSheet && [styles.cardSheet, { paddingBottom: insets.bottom + 24 }],
          ]}
          role="dialog"
          aria-label={title}
        >
          {isSheet && <View style={styles.handle} />}
          <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <CloseButton onPress={onClose} />
            </View>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.backdrop,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 24,
    backgroundColor: COLORS.white,
  },
  pageSheet: { justifyContent: "flex-end", padding: 0 },
  cardSheet: {
    maxWidth: 480,
    paddingTop: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    width: 40,
    height: 5,
    marginBottom: 16,
    alignSelf: "center",
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.headingExtraBold,
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.ink,
  },
});
