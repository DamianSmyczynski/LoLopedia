export class GamesCountIsTooHighError extends Error {
  constructor(gamesCount: number, maxGamesCount: number) {
    super(`Games count: ${gamesCount}. Maximum value is: ${maxGamesCount}`);
  }
}
