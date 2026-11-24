// Post service: the Firestore calls for posts and their photos.
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { USER_MOODS } from "../../constants/moods";
import { db } from "../../lib/firebase";

// Returns the starting reaction counts of a new post: 0 for each of the 6
// user moods (people react to posts with the moods).
function createEmptyReactionCounts() {
  return Object.fromEntries(USER_MOODS.map((mood) => [mood.key, 0]));
}

// Creates a new post. Takes the author's profile (from useAuth), the post's
// text, type and mood (a mood key or null), and the photo's base64 text (or
// null for no photo). Returns the new post's ID.
export async function createPost({ author, text, postType, mood, photoBase64 }) {
  const postRef = doc(collection(db, "posts"));
  // The photo gets the same ID as its post.
  const photoRef = photoBase64 ? doc(db, "postImages", postRef.id) : null;

  // The photo and the post are saved together or not at all, so a photo is
  // never left behind without its post (firestore.rules checks this too).
  const batch = writeBatch(db);
  if (photoRef) {
    batch.set(photoRef, {
      ownerId: author.uid,
      data: photoBase64,
      createdAt: serverTimestamp(),
    });
  }
  batch.set(postRef, {
    authorId: author.uid,
    authorUsername: author.username,
    authorHasPhoto: author.hasPhoto,
    authorMood: mood,
    postType,
    text: text.trim(),
    imageId: photoRef ? photoRef.id : null,
    reactionCounts: createEmptyReactionCounts(),
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
  return postRef.id;
}
