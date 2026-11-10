import { useState } from "react";
import { Link } from "react-router-dom";
import { FeedState } from "../components/FeedState";
import { useFeed } from "../hooks/useFeed";
import { CATEGORY_LABELS } from "../types/route";
import { YandexMapView } from "../components/YandexMapView";
export function MapPage() {
  const { routes, loading, error, reload } = useFeed();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "walk" | "food" | "culture" | "nature"
  >("all");

  if (loading || error) {
    return (
      <section className="map-page section">
        <FeedState
          loading={loading}
          error={error}
          isEmpty={false}
          onRetry={reload}
        />
      </section>
    );
  }

  const publicRoutes = routes.filter((route) => route.isPublic);
  const normalizedSearch = searchText.trim().toLocaleLowerCase("ru-RU");

  const visibleRoutes = publicRoutes.filter((route) => {
    const matchesCategory =
      selectedCategory === "all" || route.category === selectedCategory;

    const searchableText =
      `${route.title} ${route.location} ${route.description}`.toLocaleLowerCase(
        "ru-RU",
      );
    const matchesSearch = searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
  const routesWithCoordinates = visibleRoutes.filter(
  (route) => route.coordinates !== null,
).length;

  return (
    <section className="map-page section">
      <h1>Карта маршрутов</h1>
      <p>Ищите маршруты сообщества и выбирайте, куда отправиться.</p>

      <div className="map-layout">
        <aside aria-label="Поиск и список маршрутов">
          <div className="filters">
            <label>
              Поиск
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Название, место или описание"
              />
            </label>

            <label>
              Категория
              <select
                value={selectedCategory}
                onChange={(event) => {
                  const value = event.currentTarget.value;

                  if (
                    value === "all" ||
                    value === "walk" ||
                    value === "food" ||
                    value === "culture" ||
                    value === "nature"
                  ) {
                    setSelectedCategory(value);
                  }
                }}
              >
                <option value="all">Все категории</option>
                <option value="walk">{CATEGORY_LABELS.walk}</option>
                <option value="food">{CATEGORY_LABELS.food}</option>
                <option value="culture">{CATEGORY_LABELS.culture}</option>
                <option value="nature">{CATEGORY_LABELS.nature}</option>
              </select>
            </label>
          </div>

          <p role="status">Найдено маршрутов: {visibleRoutes.length}</p>

          <div className="route-list">
            {visibleRoutes.length > 0 ? (
              visibleRoutes.map((route) => (
                <Link
                  className="route-card map-route-link"
                  key={route.id}
                  to={`/routes/${route.id}`}
                >
                  <h3>{route.title}</h3>
                  <p>{route.location}</p>
                  <p>Категория: {CATEGORY_LABELS[route.category]}</p>
                  <p>
                    {route.coordinates
                      ? `Координаты: ${route.coordinates.latitude.toFixed(4)}, ${route.coordinates.longitude.toFixed(4)}`
                      : "Координаты пока не указаны"}
                  </p>
                </Link>
              ))
            ) : (
              <p>
                {publicRoutes.length === 0
                  ? "Публичных маршрутов пока нет."
                  : "По вашему запросу маршруты не найдены."}
              </p>
            )}
          </div>
        </aside>

        <div className="map-panel">
            <YandexMapView routes={visibleRoutes} />
            {routesWithCoordinates === 0 && (
                <p>
                    У этих маршрутов пока нет координат, поэтому на карте не отображаются метки.
                    </p>
            )}
        </div>
      </div>
    </section>
  );
}