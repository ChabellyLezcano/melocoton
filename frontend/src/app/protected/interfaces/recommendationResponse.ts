import { Game } from "./gameInterface";

export interface RecommendationResponse {
    ok:               boolean;
    msg:              string;
    recommendedGames: Game[];
    recommendedGame: Game
}
