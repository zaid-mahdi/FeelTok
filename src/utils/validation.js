// Text limits and checks for what users type.
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 6; // the minimum Firebase accepts
export const MAX_BIO_LENGTH = 150;

// Takes a username and returns an error message, or null if it is valid.
// Allowed: 3 to 20 lowercase letters, numbers and underscores.
export function validateUsername(username) {
  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    return `Username must be ${MIN_USERNAME_LENGTH} to ${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return "Username can only have lowercase letters, numbers and underscores.";
  }
  return null;
}

// Takes an email and returns an error message, or null if it is filled in.
// Firebase checks if it is a real email address.
export function validateEmail(email) {
  if (!email.trim()) return "Please enter your email.";
  return null;
}

// Takes the login fields and returns an error message, or null if both are
// filled in. Firebase checks if they are correct.
export function validateLogin(email, password) {
  const emailMessage = validateEmail(email);
  if (emailMessage) return emailMessage;
  if (!password) return "Please enter your password.";
  return null;
}

// Takes the sign up fields and returns an error message, or null if they are
// all valid. Firebase checks if the email is valid and not already in use.
export function validateSignUp(email, username, password, confirmedPassword) {
  const emailMessage = validateEmail(email);
  if (emailMessage) return emailMessage;
  const usernameMessage = validateUsername(username);
  if (usernameMessage) return usernameMessage;
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirmedPassword) return "The passwords don't match.";
  return null;
}

// Posts: the app counts words, and the security rules also cap the number of
// characters, because rules can't count words.
export const MAX_POST_WORDS = 500;
export const MAX_POST_CHARACTERS = 5000;

// Takes some text and returns how many words it has.
export function countWords(text) {
  const words = text.trim().split(/\s+/);
  return words[0] === "" ? 0 : words.length;
}

// Takes the post's text and type and returns what is still missing or wrong,
// as a short message, or null if the post can be posted.
export function validatePost(text, postType) {
  const hasText = text.trim().length > 0;
  if (!postType && !hasText) {
    return "Pick a post type and write something to post";
  }
  if (!postType) return "Pick a post type to post";
  if (!hasText) return "Write something to post";
  if (countWords(text) > MAX_POST_WORDS) {
    return `Your post is over ${MAX_POST_WORDS} words`;
  }
  return null;
}

// Comments: up to 500 characters (the same limit is in firestore.rules).
export const MAX_COMMENT_CHARACTERS = 500;

// Invite codes: 6 characters from letters and numbers that don't look alike
// (no I, O, 0 or 1). The same rule is in firestore.rules.
export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Takes what the user typed in the code box and returns it in capitals,
// without spaces or other signs.
export function normalizeInviteCode(text) {
  return text.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Takes a normalized code and returns an error message, or null if it could
// be a real code. Firestore checks if it exists.
export function validateInviteCode(code) {
  if (code.length !== INVITE_CODE_LENGTH) {
    return `Enter the ${INVITE_CODE_LENGTH}-character code.`;
  }
  const hasOnlyCodeCharacters = [...code].every((character) =>
    INVITE_CODE_ALPHABET.includes(character),
  );
  if (!hasOnlyCodeCharacters) {
    return "This code doesn't exist. Check it and try again.";
  }
  return null;
}

// Chat messages: up to 500 characters (the same limit is in firestore.rules).
export const MAX_MESSAGE_CHARACTERS = 500;
