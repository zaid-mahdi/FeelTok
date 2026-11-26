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
  where,
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
// text and type, and the photo's base64 text (or null for no photo). The
// post saves the author's current mood (firestore.rules checks it). Returns
// the new post's ID.
export async function createPost({ author, text, postType, photoBase64 }) {
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
    authorMood: author.mood ?? null,
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

// Loads one page of posts, newest first. Takes the last post snapshot of the
// previous page (or null for the first page) and optional filters: authorId
// (only one user's posts, for profiles) and postType (only one post type).
// Returns { posts, lastSnapshot, hasMore }: lastSnapshot is passed in to get
// the next page, and hasMore is false once the oldest post has been loaded.
// The filters need composite indexes, see firestore.indexes.json.
export async function fetchPostsPage(
  afterSnapshot,
  { authorId = null, postType = null } = {},
) {
  const constraints = [orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE)];
  if (postType) constraints.unshift(where("postType", "==", postType));
  if (authorId) constraints.unshift(where("authorId", "==", authorId));
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

// Takes a user ID and returns { postCount, reactionCount }: how many posts
// they have, and how many reactions all their posts got together. It reads
// the user's posts once and adds them up here, because Firestore's own
// sums over several fields would need extra indexes.
export async function fetchAuthorStats(authorId) {
  const snapshot = await getDocs(
    query(collection(db, "posts"), where("authorId", "==", authorId)),
  );
  let reactionCount = 0;
  snapshot.docs.forEach((postSnapshot) => {
    const counts = postSnapshot.data().reactionCounts ?? {};
    USER_MOODS.forEach((mood) => {
      reactionCount += counts[mood.key] ?? 0;
    });
  });
  return { postCount: snapshot.size, reactionCount };
}

// A Firestore batch can hold at most 500 changes.
const MAX_BATCH_WRITES = 500;

// Deletes a post with everything that belongs to it: its photo, comments and
// reactions, so nothing is left behind. Takes the post (with id and imageId).
// Used for your own posts, and later by the admin dashboard (Task 17).
export async function deletePost(post) {
  const postRef = doc(db, "posts", post.id);
  const [commentsSnapshot, reactionsSnapshot] = await Promise.all([
    getDocs(collection(db, "posts", post.id, "comments")),
    getDocs(collection(db, "posts", post.id, "reactions")),
  ]);
  const childRefs = [...commentsSnapshot.docs, ...reactionsSnapshot.docs].map(
    (childSnapshot) => childSnapshot.ref,
  );

  // The first batch deletes the post, its photo and as many comments and
  // reactions as fit. The rules only let the author delete other people's
  // comments and reactions in the same step as the post. Any left over (a
  // post with hundreds of them) are deleted in more batches: once the post is
  // gone, they belong to nothing.
  const firstBatch = writeBatch(db);
  firstBatch.delete(postRef);
  if (post.imageId) firstBatch.delete(doc(db, "postImages", post.imageId));
  const roomInFirstBatch = MAX_BATCH_WRITES - (post.imageId ? 2 : 1);
  childRefs.slice(0, roomInFirstBatch).forEach((ref) => firstBatch.delete(ref));
  await firstBatch.commit();

  const leftOver = childRefs.slice(roomInFirstBatch);
  for (let start = 0; start < leftOver.length; start += MAX_BATCH_WRITES) {
    const batch = writeBatch(db);
    leftOver
      .slice(start, start + MAX_BATCH_WRITES)
      .forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

// Takes a user ID and returns all their posts (each with its id), for
// changing their username or deleting their account.
export async function fetchAllPostsByAuthor(uid) {
  const snapshot = await getDocs(
    query(collection(db, "posts"), where("authorId", "==", uid)),
  );
  return snapshot.docs.map((postSnapshot) => ({ id: postSnapshot.id, ...postSnapshot.data() }));
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
