import { NavLink } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="site-header">
      <NavLink className="logo" to="/">WayShare</NavLink>

      <nav className="main-navigation" aria-label="Основная навигация">
        <NavLink to="/" end>Лента</NavLink>
        <NavLink to="/map">Карта</NavLink>
        <NavLink to="/routes/new">Создать маршрут</NavLink>
        <NavLink to="/profile/1">Профиль</NavLink>
      </nav>
    </header>
  );
}