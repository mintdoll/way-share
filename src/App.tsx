import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { FeedPage } from "./pages/FeedPage";

export default function App() {
  return (
    <>
      <SiteHeader />

      <main className="home-page-main">
        <FeedPage />
      </main>

      <SiteFooter />
    </>
  );
}