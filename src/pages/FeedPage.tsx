import { FeedList } from "../components/FeedList";
import { FeedState } from "../components/FeedState";
import { useFeed } from "../hooks/useFeed";

export function FeedPage() {
  const { routes, users, loading, error, reload } = useFeed();

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <img
          className="home-hero-image"
          src="/assets/images/hero-city.jpg"
          alt="Вечерний городской пейзаж"
        />

        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <p className="eyebrow">Социальная сеть маршрутов</p>
            <h1 id="hero-title">Открой город по-новому</h1>
            <p>Смотри идеи для прогулок и делись любимыми местами.</p>
            <a className="primary-button" href="/create-route.html">
              Создать маршрут
            </a>
          </div>
        </div>
      </section>

      <section className="route-feed" aria-labelledby="feed-title">
        <div className="feed-heading">
          <p className="eyebrow">Сообщество WayShare</p>
          <h2 id="feed-title">Лента маршрутов</h2>
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
    </>
  );
}