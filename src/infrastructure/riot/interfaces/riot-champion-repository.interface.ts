import { ChampionDto } from '../../../champions/champion.dto';

export interface RiotChampionRepositoryInterface {
  getAllChampions(language: string);
  getChampionDetailsById(language: string, championId: string);
  getChampionDetailsByName(language: string, championName: string);
  updateAllChampions(language: string, champions: ChampionDto[]);
  saveChampion(language: string, champion: ChampionDto);
}
