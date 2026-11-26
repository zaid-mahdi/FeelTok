// Remembers that a user was just logged out because an admin blocked them,
// so the login page can say why once. Also remembers when the login form is
// logging someone in, because then the form shows the message itself.
let wasJustBlocked = false;
let isLoggingIn = false;

// Called by logIn() before and after it logs someone in.
export function setIsLoggingIn(value) {
  isLoggingIn = value;
}

// Returns true while the login form is logging someone in.
export function getIsLoggingIn() {
  return isLoggingIn;
}

// Called when a blocked user is logged out.
export function markJustBlocked() {
  wasJustBlocked = true;
}

// Returns true once after a blocked user was logged out, then false.
export function takeJustBlocked() {
  const wasBlocked = wasJustBlocked;
  wasJustBlocked = false;
  return wasBlocked;
}
