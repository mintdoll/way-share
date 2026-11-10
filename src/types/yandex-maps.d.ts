interface YandexPlacemark {}

interface YandexMapInstance {
  geoObjects: {
    add(placemark: YandexPlacemark): void;
    removeAll(): void;
  };
  destroy(): void;
}

interface YandexMapsApi {
  ready(callback: () => void): void;
  Map: new (
    container: HTMLElement,
    state: {
      center: [number, number];
      zoom: number;
      controls?: string[];
    },
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: [number, number],
    properties: {
      balloonContent: string;
    },
  ) => YandexPlacemark;
}

interface Window {
  ymaps?: YandexMapsApi;
}