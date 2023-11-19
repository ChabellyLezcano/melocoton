import { Game } from './gameInterface';

export interface FavoriteResponse {
  ok: boolean;
  msg: string;
  games: Game[];
  game: Game;
}
