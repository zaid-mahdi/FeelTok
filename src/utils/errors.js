// Turns errors into messages that users can understand.

// Our own error code, for when another user already has the username.
export const USERNAME_TAKEN_CODE = "username-taken";

// Our own error codes for photos: the picked file is too big, or still too big
// after it was made smaller.
export const PHOTO_TOO_BIG_CODE = "photo-too-big";
export const PHOTO_TOO_DETAILED_CODE = "photo-too-detailed";

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
  [USERNAME_TAKEN_CODE]: "This username is already taken.",
  [PHOTO_TOO_BIG_CODE]: "This photo is too big. Pick one up to 10 MB.",
  [PHOTO_TOO_DETAILED_CODE]:
    "We could not make this photo small enough. Please pick another one.",
  "permission-denied": "You don't have permission to do this.",
  unavailable: "No internet connection. Please check it and try again.",
};

// Takes an error and returns a friendly message to show the user.
export function friendlyError(error) {
  return (
    ERROR_MESSAGES[error?.code] ?? "Something went wrong. Please try again."
  );
}
