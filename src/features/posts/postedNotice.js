// Remembers that the user has just created a post, so Home can show the
// "Posted" message once when it opens again.
let hasJustPosted = false;

// Called by the New post page after a post is saved.
export function markJustPosted() {
  hasJustPosted = true;
}

// Returns true once after a post was saved, then false until the next post.
export function takeJustPosted() {
  const wasJustPosted = hasJustPosted;
  hasJustPosted = false;
  return wasJustPosted;
}
