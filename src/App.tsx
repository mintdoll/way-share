import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout, NotFoundPage } from "./components/SiteLayout";
import { FeedPage } from "./pages/FeedPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RouteDetailsPage } from "./pages/RouteDetailsPage";
import { CreateRoutePage } from "./pages/CreateRoutePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/routes" element={<Navigate to="/" replace />} />
          <Route path="/routes/new" element={<CreateRoutePage />} />
          <Route
            path="/routes/:routeId"
            element={<RouteDetailsPage />}
          />
          <Route
            path="/profile/:userId"
            element={<ProfilePage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}