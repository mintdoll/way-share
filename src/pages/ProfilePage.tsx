import { useParams } from "react-router-dom";
import { FeedList } from "../components/FeedList";
import { FeedState } from "../components/FeedState";
import { useFeed } from "../hooks/useFeed";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const parsedId = Number(userId);
  const profileId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const { routes, users, follows, loading, error, reload } = useFeed();

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

  const user = users.find((item) => item.id === profileId);

  if (!user) {
    return (
      <section className="section">
        <h1>Профиль не найден</h1>
        <p>Проверьте ссылку или вернитесь к ленте маршрутов.</p>
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
      <div className="profile-summary">
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

        <div className="profile-info">
          <p className="eyebrow">@{user.username}</p>
          <h1>{user.displayName}</h1>
          <p className="muted">{user.bio}</p>

          <div className="profile-stats">
            <div>
              <strong>{userRoutes.length}</strong>
              <span>маршрутов</span>
            </div>
            <div>
              <strong>{followersCount}</strong>
              <span>подписчиков</span>
            </div>
            <div>
              <strong>{followingCount}</strong>
              <span>подписок</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-routes">
        <h2>Маршруты пользователя</h2>
        {userRoutes.length > 0 ? (
          <FeedList routes={userRoutes} users={users} />
        ) : (
          <p>Пользователь пока не опубликовал маршруты.</p>
        )}
      </div>
    </section>
  );
}