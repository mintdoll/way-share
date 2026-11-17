import { Link, useNavigate } from "react-router-dom";
import { createRoute } from "../api/feed";
import { RouteForm } from "../components/RouteForm";
import type { RouteInput } from "../types/route";

export function CreateRoutePage() {
  const navigate = useNavigate();

  async function handleCreate(input: RouteInput) {
    const createdRoute = await createRoute(input);
    navigate(`/routes/${createdRoute.id}`);
  }

  return (
    <section className="section form-section">
      <Link className="back-link" to="/">
        ← Вернуться к ленте
      </Link>

      <p className="eyebrow">Новая публикация</p>
      <h1>Поделитесь маршрутом</h1>
      <p className="muted">
        Расскажите о месте и добавьте фотографию, чтобы другие могли открыть город.
      </p>

      <RouteForm onSubmit={handleCreate} />
    </section>
  );
}