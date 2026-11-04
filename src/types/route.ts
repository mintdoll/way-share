export type RouteCategory = "walk" | "food" | "culture" | "nature";
export type RouteFormat = "solo" | "friends" | "family";
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface Route {
  id: number;
  authorId: number;
  title: string;
  category: RouteCategory;
  location: string;
  budget: number;
  duration: number;
  description: string;
  format: RouteFormat;
  isPublic: boolean;
  photoUrl: string;
  publishedAt: string;
  coordinates: Coordinates | null;
}
export type RouteInput = Omit<Route, "id">;
export const CATEGORY_LABELS: Record<RouteCategory, string> = {
  walk: "Прогулка",
  food: "Еда",
  culture: "Культура",
  nature: "Природа",
};
export const FORMAT_LABELS: Record<RouteFormat, string> = {
  solo: "В одиночестве",
  friends: "С друзьями",
  family: "С семьёй",
};