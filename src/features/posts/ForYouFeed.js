// The For You feed: every post, newest first, 10 at a time.
import PostList from "./PostList";

// Shows all posts, with the shared post list.
export default function ForYouFeed() {
  return <PostList emptyMessage="No posts yet. Be the first!" />;
}
