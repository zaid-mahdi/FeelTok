// Turns errors into messages that users can understand.

// Our own error code, for when another user already has the username.
export const USERNAME_TAKEN_CODE = "username-taken";

// Our own error codes for photos: the picked file is too big, or still too big
// after it was made smaller.
export const PHOTO_TOO_BIG_CODE = "photo-too-big";
export const PHOTO_TOO_DETAILED_CODE = "photo-too-detailed";

// Our own error codes for adding a friend with an invite code.
export const INVITE_CODE_NOT_FOUND_CODE = "invite-code-not-found";
export const INVITE_CODE_USED_CODE = "invite-code-used";
export const OWN_INVITE_CODE_CODE = "own-invite-code";
export const ALREADY_FRIENDS_CODE = "already-friends";

// Our own error code for a wrong current password in Account settings.
export const WRONG_CURRENT_PASSWORD_CODE = "wrong-current-password";

// Takes one of our own error codes and returns an error with that code, so
// friendlyError() can show its message.
export function createAppError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

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
  [INVITE_CODE_NOT_FOUND_CODE]:
    "This code doesn't exist. Check it and try again.",
  [INVITE_CODE_USED_CODE]:
    "This code was already used. Ask your friend for a new one.",
  [OWN_INVITE_CODE_CODE]:
    "That's your own code. Share it with a friend instead.",
  [ALREADY_FRIENDS_CODE]: "You're already friends with this person.",
  [WRONG_CURRENT_PASSWORD_CODE]: "Your password is wrong. Please try again.",
  "auth/requires-recent-login":
    "For your safety, please log out and log in again, then try again.",
  "permission-denied": "You don't have permission to do this.",
  unavailable: "No internet connection. Please check it and try again.",
};

// Takes an error and returns a friendly message to show the user.
export function friendlyError(error) {
  return (
    ERROR_MESSAGES[error?.code] ?? "Something went wrong. Please try again."
  );
}
