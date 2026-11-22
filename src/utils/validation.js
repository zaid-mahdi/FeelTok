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
