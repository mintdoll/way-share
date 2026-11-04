export interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}
export interface Follow {
  id: number;
  followerId: number;
  followedId: number;
}
export interface SavedRoute {
  id: number;
  userId: number;
  routeId: number;
}