// Comment service: the Firestore calls for comments on posts. Comments are in
// posts/{postId}/comments, and the post keeps their number in commentCount.
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// Takes a post ID and returns all its comments, oldest first. Each comment
// has its id, authorId, authorUsername, text and createdAt.
export async function fetchComments(postId) {
  const snapshot = await getDocs(
    query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc")),
  );
  return snapshot.docs.map((commentSnapshot) => ({
    id: commentSnapshot.id,
    ...commentSnapshot.data(),
  }));
}

// Adds a comment to a post. Takes the post ID, the author's profile (from
// useAuth) and the text. Returns the new comment (its time is null until the
// server sets it).
export async function addComment(postId, author, text) {
  const commentRef = doc(collection(db, "posts", postId, "comments"));
  const comment = {
    authorId: author.uid,
    authorUsername: author.username,
    text: text.trim(),
  };

  // The comment and the post's comment count are saved together, so the count
  // always matches the comments.
  const batch = writeBatch(db);
  batch.set(commentRef, { ...comment, createdAt: serverTimestamp() });
  batch.update(doc(db, "posts", postId), { commentCount: increment(1) });
  await batch.commit();

  return { id: commentRef.id, ...comment, createdAt: null };
}

// Deletes one of the user's own comments, and takes 1 from the post's comment
// count in the same step. Takes the post ID and the comment ID.
export async function deleteComment(postId, commentId) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "posts", postId, "comments", commentId));
  batch.update(doc(db, "posts", postId), { commentCount: increment(-1) });
  await batch.commit();
}
