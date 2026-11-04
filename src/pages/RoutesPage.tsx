import { FeedList } from "../components/FeedList";
import { FeedState } from "../components/FeedState";
import { useFeed } from "../hooks/useFeed";

export function RoutesPage() {
  const { routes, users, loading, error, reload } = useFeed();

  return (
    <section className="route-feed routes-page" aria-labelledby="routes-title">
      <div className="feed-heading">
        <p className="eyebrow">Исследуй город</p>
        <h1 id="routes-title">Маршруты сообщества</h1>
      </div>

      <FeedState
        loading={loading}
        error={error}
        isEmpty={routes.length === 0}
        onRetry={reload}
      />

      {!loading && !error && routes.length > 0 && (
        <FeedList routes={routes} users={users} />
      )}
    </section>
  );
}