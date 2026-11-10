import { Link, useLocation, useParams } from "react-router-dom";
import { FeedPost } from "../components/FeedPost";
import { FeedState } from "../components/FeedState";
import { useRouteDetails } from "../hooks/useRouteDetails";

export function RouteDetailsPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const location = useLocation();
  const fromProfileUserId = location.state?.fromProfileUserId;
  const profileReturnTo =
  typeof fromProfileUserId === "number" &&
  Number.isInteger(fromProfileUserId) &&
  fromProfileUserId > 0
    ? `/profile/${fromProfileUserId}`
    : null;
  const parsedId = Number(routeId);
  const id = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const { route, author, loading, error, reload } = useRouteDetails(id);

  if (loading || error) {
    return (
      <section className="section">
        <FeedState
          loading={loading}
          error={error}
          isEmpty={false}
          onRetry={reload}
        />
      </section>
    );
  }

  if (!route || !author) {
    return (
      <section className="section">
        <h1>Маршрут не найден</h1>
        <Link to="/routes">Вернуться к маршрутам</Link>
      </section>
    );
  }

  return (
    <section className="route-details-page section">
      <Link className="back-link" to={profileReturnTo ?? "/"}>
         {profileReturnTo ? "← Вернуться к профилю" : "← Все маршруты"}
      </Link>
      <FeedPost route={route} author={author} />
    </section>
  );
}