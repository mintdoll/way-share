import { Link, useParams } from "react-router-dom";
import { FeedState } from "../components/FeedState";
import { useFeed } from "../hooks/useFeed";
import { CATEGORY_LABELS } from "../types/route";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const parsedId = Number(userId);
  const profileId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const { routes, users, follows, loading, error, reload } = useFeed();

  if (loading || error) {
    return (
      <section className="profile-page section">
        <FeedState
          loading={loading}
          error={error}
          isEmpty={false}
          onRetry={reload}
        />
      </section>
    );
  }

  const user = users.find((item) => item.id === profileId);

  if (!user) {
    return (
      <section className="profile-page section">
        <h1>Профиль не найден</h1>
        <p>Проверьте ссылку или вернитесь к ленте.</p>
        <Link className="secondary-button" to="/">
          Перейти к ленте
        </Link>
      </section>
    );
  }

  const userRoutes = routes.filter((route) => route.authorId === user.id);
  const followersCount = follows.filter(
    (follow) => follow.followedId === user.id,
  ).length;
  const followingCount = follows.filter(
    (follow) => follow.followerId === user.id,
  ).length;

  const initials = user.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("ru-RU") ?? "")
    .join("");

  return (
    <section className="profile-page section">
      <header className="profile-header">
        {user.avatarUrl ? (
          <img
            className="profile-avatar"
            src={user.avatarUrl}
            alt={`Аватар пользователя ${user.displayName}`}
          />
        ) : (
          <div className="profile-avatar profile-avatar-placeholder" aria-hidden="true">
            {initials || "?"}
          </div>
        )}

        <div className="profile-details">
          <div className="profile-title-row">
            <h1>{user.username}</h1>
            <Link className="profile-action" to="/routes/new">
              Создать маршрут
            </Link>
          </div>

          <div className="profile-stats" aria-label="Статистика профиля">
            <span><strong>{userRoutes.length}</strong> публикаций</span>
            <span><strong>{followersCount}</strong> подписчиков</span>
            <span><strong>{followingCount}</strong> подписок</span>
          </div>

          <div className="profile-bio">
            <strong>{user.displayName}</strong>
            <p>{user.bio}</p>
          </div>
        </div>
      </header>

      <nav className="profile-tabs" aria-label="Разделы профиля">
        <span className="profile-tab profile-tab-active">Публикации</span>
      </nav>

      {userRoutes.length > 0 ? (
        <div className="profile-post-grid">
          {userRoutes.map((route) => (
            <Link
              className="profile-post"
              key={route.id}
              to={`/routes/${route.id}`}
              state={{ fromProfileUserId: user.id }}
              aria-label={`${route.title}, категория ${CATEGORY_LABELS[route.category]}`}
            >
              <img src={route.photoUrl} alt="" />
              <span className="profile-post-overlay">
                <strong>{route.title}</strong>
                <span>{CATEGORY_LABELS[route.category]}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="profile-empty">
          <h2>Публикаций пока нет</h2>
          <p>Создайте первый маршрут и поделитесь им с сообществом.</p>
          <Link className="primary-button" to="/routes/new">
            Создать маршрут
          </Link>
        </div>
      )}
    </section>
  );
}