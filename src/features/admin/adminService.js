// Admin service (Task 17): the Firestore calls of the admin dashboard. The
// security rules allow them only for admins.
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { fetchComments } from "../comments/commentService";
import { fetchAllPostsByAuthor } from "../posts/postService";
import { fetchProfile } from "../profile/profileService";

// How many of the newest posts the dashboard shows to moderate.
const RECENT_POSTS_COUNT = 10;

// Returns the three numbers on the dashboard: totalUsers, totalPosts and
// blockedUsers. Firestore counts them, so nothing is downloaded.
export async function fetchAdminStats() {
  const [users, posts, blocked] = await Promise.all([
    getCountFromServer(collection(db, "users")),
    getCountFromServer(collection(db, "posts")),
    getCountFromServer(query(collection(db, "users"), where("banned", "==", true))),
  ]);
  return {
    totalUsers: users.data().count,
    totalPosts: posts.data().count,
    blockedUsers: blocked.data().count,
  };
}

// Returns the newest 10 posts (each with its id), for "Recent posts to
// moderate".
export async function fetchRecentPosts() {
  const snapshot = await getDocs(
    query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(RECENT_POSTS_COUNT)),
  );
  return snapshot.docs.map((postSnapshot) => ({ id: postSnapshot.id, ...postSnapshot.data() }));
}

// Returns all users (each with uid and postCount), newest first, for the
// Users table. Firestore counts each user's posts.
export async function fetchAllUsers() {
  const snapshot = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  const users = snapshot.docs.map((userSnapshot) => ({ uid: userSnapshot.id, ...userSnapshot.data() }));
  const postCounts = await Promise.all(
    users.map((user) =>
      getCountFromServer(query(collection(db, "posts"), where("authorId", "==", user.uid))),
    ),
  );
  return users.map((user, index) => ({ ...user, postCount: postCounts[index].data().count }));
}

// Takes a user ID and returns { profile, posts } for the user page: their
// profile (or null) and all their posts, newest first, each with its
// comments (oldest first).
export async function fetchUserWithPosts(uid) {
  const [profile, posts] = await Promise.all([fetchProfile(uid), fetchAllPostsByAuthor(uid)]);
  const newestFirst = posts.sort(
    (postA, postB) => (postB.createdAt?.toMillis() ?? 0) - (postA.createdAt?.toMillis() ?? 0),
  );
  const comments = await Promise.all(newestFirst.map((post) => fetchComments(post.id)));
  return {
    profile,
    posts: newestFirst.map((post, index) => ({ ...post, comments: comments[index] })),
  };
}

// Blocks (isBlocked true) or unblocks a user. A blocked user is logged out
// and can't log in until they are unblocked.
export async function setUserBlocked(uid, isBlocked) {
  await updateDoc(doc(db, "users", uid), { banned: isBlocked });
}
