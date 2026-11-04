import type {
  Coordinates,
  Route,
  RouteCategory,
  RouteFormat,
  RouteInput,
} from "../types/route";
import type { Follow, User } from "../types/social";

export interface FeedData {
  routes: Route[];
  users: User[];
  follows: Follow[];
}

export interface RouteDetails {
  route: Route;
  author: User;
}

const API_URL = "http://127.0.0.1:3001";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCategory(value: unknown): value is RouteCategory {
  return (
    value === "walk" ||
    value === "food" ||
    value === "culture" ||
    value === "nature"
  );
}

function isFormat(value: unknown): value is RouteFormat {
  return value === "solo" || value === "friends" || value === "family";
}

function isCoordinates(value: unknown): value is Coordinates | null {
  if (value === null) return true;

  return (
    isRecord(value) &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  );
}

function parseRoute(value: unknown): Route {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    typeof value.authorId !== "number" ||
    typeof value.title !== "string" ||
    !isCategory(value.category) ||
    typeof value.location !== "string" ||
    typeof value.budget !== "number" ||
    typeof value.duration !== "number" ||
    typeof value.description !== "string" ||
    !isFormat(value.format) ||
    typeof value.isPublic !== "boolean" ||
    typeof value.photoUrl !== "string" ||
    typeof value.publishedAt !== "string" ||
    !isCoordinates(value.coordinates)
  ) {
    throw new Error("Сервер вернул маршрут в неверном формате.");
  }

  return {
    id: value.id,
    authorId: value.authorId,
    title: value.title,
    category: value.category,
    location: value.location,
    budget: value.budget,
    duration: value.duration,
    description: value.description,
    format: value.format,
    isPublic: value.isPublic,
    photoUrl: value.photoUrl,
    publishedAt: value.publishedAt,
    coordinates: value.coordinates,
  };
}

function parseUser(value: unknown): User {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    typeof value.username !== "string" ||
    typeof value.displayName !== "string" ||
    typeof value.bio !== "string" ||
    typeof value.avatarUrl !== "string"
  ) {
    throw new Error("Сервер вернул пользователя в неверном формате.");
  }

  return {
    id: value.id,
    username: value.username,
    displayName: value.displayName,
    bio: value.bio,
    avatarUrl: value.avatarUrl,
  };
}

function parseFollow(value: unknown): Follow {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    typeof value.followerId !== "number" ||
    typeof value.followedId !== "number"
  ) {
    throw new Error("Сервер вернул подписку в неверном формате.");
  }

  return {
    id: value.id,
    followerId: value.followerId,
    followedId: value.followedId,
  };
}

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Ошибка API: HTTP ${response.status}`);
  }

  return (await response.json()) as unknown;
}

async function getCollection(path: string): Promise<unknown[]> {
  const data = await getJson(path);

  if (!Array.isArray(data)) {
    throw new Error(`API вернул не список данных: ${path}`);
  }

  return data;
}

export async function fetchFeed(): Promise<FeedData> {
  const [routeData, userData, followData] = await Promise.all([
    getCollection("/routes"),
    getCollection("/users"),
    getCollection("/follows"),
  ]);

  const routes = routeData.map(parseRoute);
  const users = userData.map(parseUser);
  const follows = followData.map(parseFollow);

  routes.sort(
    (first, second) =>
      Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );

  return { routes, users, follows };
}

export async function fetchRouteDetails(
  routeId: number,
): Promise<RouteDetails> {
  const route = parseRoute(await getJson(`/routes/${routeId}`));
  const author = parseUser(await getJson(`/users/${route.authorId}`));

  return { route, author };
}
export async function createRoute(input: RouteInput): Promise<Route> { //POST отправляет данные нового маршрута
  const response = await fetch(`${API_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Не удалось создать маршрут: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  return parseRoute(data);
}