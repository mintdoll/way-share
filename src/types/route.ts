export type RouteCategory = "walk" | "food" | "culture" | "nature";
export type RouteFormat = "solo" | "friends" | "family";
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
export interface Route {
  id: number;
  title: string;
  category: RouteCategory;
  location: string;
  budget: number;
  duration: number;
  description: string;
  format: RouteFormat;
  isPublic: boolean;
}
export type RouteInput = Omit<Route, "id">;