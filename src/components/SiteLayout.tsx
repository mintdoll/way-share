import { NavLink, Outlet } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <main className="home-page-main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="section">
      <h1>Страница не найдена</h1>
      <NavLink to="/">Вернуться на главную</NavLink>
    </section>
  );
}