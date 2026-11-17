import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { FeedPost } from "../components/FeedPost";
import { FeedState } from "../components/FeedState";
import { useRouteDetails } from "../hooks/useRouteDetails";
import { useState } from "react";
import { deleteRoute } from "../api/feed";

export function RouteDetailsPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  async function handleDelete() {
  if (
    !route ||
    route.authorId !== 1 ||
    !window.confirm(`Удалить маршрут «${route.title}»?`)
  ) {
    return;
  }

  setDeleteError(null);
  setDeleting(true);

  try {
    await deleteRoute(route.id);
    navigate("/profile/1", { replace: true });
  } catch (reason) {
    setDeleteError(
      reason instanceof Error
        ? reason.message
        : "Не удалось удалить маршрут.",
    );
  } finally {
    setDeleting(false);
  }
}
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
      {route.authorId === 1 && (
        <div className="actions">
            <Link
              className="secondary-button"
              to={`/routes/${route.id}/edit`}
              state={
                profileReturnTo
                ? { fromProfileUserId }
                : null
                }
            >
                Редактировать
            </Link>
            <button
            className="secondary-button"
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            >
                {deleting ? "Удаляем..." : "Удалить"}
            </button>
        </div>
    )}
{deleteError && <p role="alert">{deleteError}</p>}
    </section>
  );
}