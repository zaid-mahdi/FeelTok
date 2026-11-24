// Post service: the Firestore calls for posts and their photos.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch,
} from "firebase/firestore";
import { USER_MOODS } from "../../constants/moods";
import { db } from "../../lib/firebase";

export const POSTS_PER_PAGE = 10;

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

// Loads one page of the For You feed: all posts, newest first. Takes the last
// post snapshot of the previous page, or null for the first page. Returns
// { posts, lastSnapshot, hasMore }: lastSnapshot is passed in to get the next
// page, and hasMore is false once the oldest post has been loaded.
export async function fetchPostsPage(afterSnapshot) {
  const constraints = [orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE)];
  if (afterSnapshot) constraints.push(startAfter(afterSnapshot));
  const snapshot = await getDocs(query(collection(db, "posts"), ...constraints));

  return {
    posts: snapshot.docs.map((postSnapshot) => ({
      id: postSnapshot.id,
      ...postSnapshot.data(),
    })),
    lastSnapshot: snapshot.docs.at(-1) ?? afterSnapshot,
    hasMore: snapshot.docs.length === POSTS_PER_PAGE,
  };
}

// Takes a post ID and returns the post (with its id), or null if it doesn't
// exist.
export async function fetchPost(postId) {
  const postSnapshot = await getDoc(doc(db, "posts", postId));
  if (!postSnapshot.exists()) return null;
  return { id: postSnapshot.id, ...postSnapshot.data() };
}

// Takes a post ID and returns its photo as a data URI that an Image can show,
// or null if the photo doesn't exist.
export async function fetchPostPhoto(postId) {
  const photoSnapshot = await getDoc(doc(db, "postImages", postId));
  if (!photoSnapshot.exists()) return null;
  return `data:image/jpeg;base64,${photoSnapshot.data().data}`;
}
