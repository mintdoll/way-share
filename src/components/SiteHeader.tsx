export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="logo" href="/">WayShare</a>

      <nav className="main-navigation" aria-label="Основная навигация">
        <a href="/" aria-current="page">Лента</a>
        <a href="/map.html">Карта</a>
        <a href="/create-route.html">Создать маршрут</a>
        <a href="/profile.html">Профиль</a>
      </nav>
    </header>
  );
}