import { useEffect, useState } from "react";
import { fetchRouteDetails } from "../api/feed";
import type { RouteDetails } from "../api/feed";

export function useRouteDetails(routeId: number | null) {
  const [details, setDetails] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadNumber, setReloadNumber] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      if (routeId === null) {
        setError("В адресе указан некорректный номер маршрута.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchRouteDetails(routeId);

        if (active) {
          setDetails(result);
        }
      } catch (reason) {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Не удалось загрузить маршрут.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      active = false;
    };
  }, [routeId, reloadNumber]);

  function reload() {
    setReloadNumber((current) => current + 1);
  }

  return { ...details, loading, error, reload };
}