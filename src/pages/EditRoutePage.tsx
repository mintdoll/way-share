import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { updateRoute } from "../api/feed";
import { RouteForm } from "../components/RouteForm";
import { FeedState } from "../components/FeedState";
import { useRouteDetails } from "../hooks/useRouteDetails";
import type { RouteInput } from "../types/route";

export function EditRoutePage() {
  const { routeId } = useParams<{ routeId: string }>();
  const parsedId = Number(routeId);
  const id = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const { route, loading, error, reload } = useRouteDetails(id);
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfileUserId = location.state?.fromProfileUserId;
  const profileReturnState =
    typeof fromProfileUserId === "number" &&
    Number.isInteger(fromProfileUserId) &&
    fromProfileUserId > 0
      ? { fromProfileUserId }
      : null;

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

  if (!route) {
    return (
      <section className="section">
        <h1>Маршрут не найден</h1>
        <Link to="/">Вернуться к ленте</Link>
      </section>
    );
  }

  if (route.authorId !== 1) {
    return (
      <section className="section">
        <h1>Редактирование недоступно</h1>
        <p>Вы можете редактировать только свои маршруты.</p>
        <Link to={`/routes/${route.id}`}>Вернуться к маршруту</Link>
      </section>
    );
  }
  const editableRoute = route;

  async function handleUpdate(input: RouteInput) {
  await updateRoute(editableRoute.id, input);
  navigate(`/routes/${editableRoute.id}`, {
  replace: true,
  state: profileReturnState,
  });
  }

  return (
    <section className="section form-section">
      <Link
        className="back-link"
        to={`/routes/${editableRoute.id}`}
        state={profileReturnState}
      >
        ← Вернуться к маршруту
    </Link>
      <p className="eyebrow">Редактирование</p>
      <h1>Изменить маршрут</h1>
      <RouteForm
        key={editableRoute.id}
        initialRoute={editableRoute}
        onSubmit={handleUpdate}
      />
    </section>
  );
}