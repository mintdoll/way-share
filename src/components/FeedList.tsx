import type { Route } from "../types/route";
import type { User } from "../types/social";
import { FeedPost } from "./FeedPost";

interface FeedListProps {
  routes: Route[];
  users: User[];
}

export function FeedList({ routes, users }: FeedListProps) {
  return (
    <div className="route-feed-list">
      {routes.map((route) => {
        const author = users.find((user) => user.id === route.authorId);

        return (
          <FeedPost
            key={route.id}
            route={route}
            author={author}
          />
        );
      })}
    </div>
  );
}