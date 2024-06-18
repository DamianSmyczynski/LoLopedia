import { ChampionDto } from 'src/champions/champion.dto';

export interface RiotChampionRepositoryInterface {
  getAllChampions(language: string);
  getChampionDetails(language: string, championName: string);
  updateAllChampions(language: string, champions: ChampionDto[]);
  saveChampion(language: string, champion: ChampionDto);
}
