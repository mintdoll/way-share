import { useEffect, useState } from "react";
import { fetchFeed } from "../api/feed";
import type { FeedData } from "../api/feed";

export function useFeed() {
  const [feed, setFeed] = useState<FeedData>({
    routes: [],
    users: [],
    follows: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadNumber, setReloadNumber] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFeed();

        if (active) {
          setFeed(data);
        }
      } catch (reason) {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Не удалось загрузить ленту.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFeed();

    return () => {
      active = false;
    };
  }, [reloadNumber]);

  function reload() {
    setReloadNumber((current) => current + 1);
  }

  return { ...feed, loading, error, reload };
}