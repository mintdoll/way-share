import { CATEGORY_LABELS } from "../types/route";
import type { Route } from "../types/route";
import type { User } from "../types/social";
import { Link } from "react-router-dom";

interface FeedPostProps {
  route: Route;
  author: User | undefined;
}

export function FeedPost({ route, author }: FeedPostProps) {
  const publishedDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(route.publishedAt));
    const initials =
    author?.displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toLocaleUpperCase("ru-RU") ?? "")
      .join("") || "?";

  return (
    <article className="route-card feed-post">
      <header className="feed-post-header">
                {author?.avatarUrl ? (
          <img
            className="feed-author-avatar"
            src={author.avatarUrl}
            alt=""
          />
        ) : (
          <span className="feed-author-avatar" aria-hidden="true">
            {initials}
          </span>
        )}

        <div>
          {author ? (
            <Link to={`/profile/${author.id}`}>
                <strong>{author.displayName}</strong>
            </Link>
          ) : (
            <strong>Неизвестный пользователь</strong>
        )}
          <p className="muted">@{author?.username ?? "unknown"}</p>
        </div>

        <time className="muted" dateTime={route.publishedAt}>
          {publishedDate}
        </time>
      </header>

      <img
        className="feed-post-cover"
        src={route.photoUrl}
        alt={`Фото маршрута «${route.title}»`}
      />

      <div className="feed-post-content">
        <p className="eyebrow">{CATEGORY_LABELS[route.category]}</p>
        <h2>
            <Link to={`/routes/${route.id}`}>{route.title}</Link>
        </h2>
        <p>{route.description}</p>
        <p className="route-meta">
          {route.location} · {route.duration} ч ·{" "}
          {route.budget === 0 ? "Бесплатно" : `${route.budget} ₽`}
        </p>
      </div>
    </article>
  );
}