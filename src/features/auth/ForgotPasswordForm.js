// Forgot password form: the email field and the Send Link button.
import { useState } from "react";
import { View } from "react-native";
import ErrorText from "../../components/ErrorText";
import NoticeText from "../../components/NoticeText";
import PrimaryButton from "../../components/PrimaryButton";
import { friendlyError } from "../../utils/errors";
import { validateEmail } from "../../utils/validation";
import { sendPasswordReset } from "./authService";
import EmailField from "./EmailField";

// The same message for every email, so nobody can use this page to find out
// who has an account.
const LINK_SENT_MESSAGE =
  "If an account exists for this email, we've sent a reset link.";

// Shows the email field and sends the reset link. Takes no props.
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [noticeMessage, setNoticeMessage] = useState(null);

  // Checks the email, then asks Firebase to send the reset link. Shows the
  // neutral message, or a friendly error if something went wrong.
  async function handleSubmit() {
    if (isSubmitting) return;

    const validationMessage = validateEmail(email);
    setErrorMessage(validationMessage);
    setNoticeMessage(null);
    if (validationMessage) return;

    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setNoticeMessage(LINK_SENT_MESSAGE);
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
    setIsSubmitting(false);
  }

  return (
    <View>
      <EmailField
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={handleSubmit}
      />
      <ErrorText message={errorMessage} />
      <NoticeText message={noticeMessage} />
      <PrimaryButton
        title="Send Link"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );
}
