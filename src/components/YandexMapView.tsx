import { useEffect, useRef, useState } from "react";
import type { Route } from "../types/route";

interface YandexMapViewProps {
  routes: Route[];
}

let apiPromise: Promise<YandexMapsApi> | null = null;

function loadYandexMapsApi(): Promise<YandexMapsApi> {
  const existingApi = window.ymaps;

  if (existingApi) {
    return new Promise((resolve) => {
      existingApi.ready(() => resolve(existingApi));
    });
  }

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error("Не задан ключ Яндекс Карт в файле .env.local."),
    );
  }

  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}` +
        "&lang=ru_RU";
      script.async = true;

      script.onload = () => {
        const loadedApi = window.ymaps;

        if (!loadedApi) {
          apiPromise = null;
          reject(new Error("Скрипт загрузился, но API Яндекс Карт недоступен."));
          return;
        }

        loadedApi.ready(() => resolve(loadedApi));
      };

      script.onerror = () => {
        apiPromise = null;
        reject(new Error("Не удалось загрузить API Яндекс Карт."));
      };

      document.head.appendChild(script);
    });
  }

  return apiPromise;
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export function YandexMapView({ routes }: YandexMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const apiRef = useRef<YandexMapsApi | null>(null);
  const routesRef = useRef(routes);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateMarkers() {
    const map = mapRef.current;
    const api = apiRef.current;

    if (!map || !api) return;

    map.geoObjects.removeAll();

    routesRef.current.forEach((route) => {
      if (!route.coordinates) return;

      const title = escapeHtml(route.title);
      const location = escapeHtml(route.location);

      const placemark = new api.Placemark(
        [route.coordinates.latitude, route.coordinates.longitude],
        { balloonContent: `<strong>${title}</strong><br>${location}` },
      );

      map.geoObjects.add(placemark);
    });
  }

  useEffect(() => {
    routesRef.current = routes;
    updateMarkers();
  }, [routes]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      try {
        const api = await loadYandexMapsApi();

        if (cancelled || !containerRef.current) return;

        apiRef.current = api;
        mapRef.current = new api.Map(containerRef.current, {
          center: [52.286974, 104.305018],
          zoom: 12,
          controls: ["zoomControl"],
        });

        updateMarkers();
        setReady(true);
      } catch (reason) {
        if (cancelled) return;

        setError(
          reason instanceof Error
            ? reason.message
            : "Не удалось инициализировать карту.",
        );
      }
    }

    void initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      apiRef.current = null;
    };
  }, []);

  return (
    <div
      className="map-canvas"
      ref={containerRef}
      role="region"
      aria-label="Интерактивная карта маршрутов"
    >
      {error && <p className="map-canvas-message" role="alert">{error}</p>}
      {!error && !ready && (
        <p className="map-canvas-message" role="status">
          Загружаем карту...
        </p>
      )}
    </div>
  );
}