import { BasicGameDto } from '../../../games/dto/basic-game/basic-game.dto';

export interface RiotGameRepositoryInterface {
  getAllByPuuid(puuid: string);
  save(game: BasicGameDto);
  updateList(games: BasicGameDto[]);
  updateGameIds(gamesIds: string[], puuid: string);
  getGamesFromRange(puuid: string, start: number, count: number);
}
