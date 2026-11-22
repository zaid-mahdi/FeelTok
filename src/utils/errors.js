// Turns Firebase errors into messages that users can understand.
const ERROR_MESSAGES = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/invalid-login-credentials": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "Wrong email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed":
    "No internet connection. Please check it and try again.",
  "auth/email-already-in-use": "This email is already in use.",
  "auth/weak-password": "Please choose a stronger password.",
  "permission-denied": "You don't have permission to do this.",
  unavailable: "No internet connection. Please check it and try again.",
};

// Takes a Firebase error and returns a friendly message to show the user.
export function friendlyError(error) {
  return (
    ERROR_MESSAGES[error?.code] ?? "Something went wrong. Please try again."
  );
}
