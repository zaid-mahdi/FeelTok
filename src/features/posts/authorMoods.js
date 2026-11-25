// Adds each post author's current mood to a list of posts, so post card
// avatars can show how the author feels now (not only when they posted).
import { fetchProfiles } from "../profile/profileService";

// Takes a list of posts and returns them with authorCurrentMood: the author's
// current mood key, or null. Each author's profile is read once, however many
// of their posts are in the list. If the profiles can't be read, the posts
// are returned as they are (the cards then show the mood when posting).
export async function addAuthorMoods(posts) {
  if (posts.length === 0) return posts;
  try {
    const profiles = await fetchProfiles(posts.map((post) => post.authorId));
    return posts.map((post) => ({
      ...post,
      authorCurrentMood: profiles[post.authorId]?.mood ?? null,
    }));
  } catch {
    return posts;
  }
}
