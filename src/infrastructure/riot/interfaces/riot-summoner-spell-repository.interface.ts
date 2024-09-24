import { SummonerSpellDto } from '../../../summoner-spells/summoner-spell.dto';

export interface RiotSummonerSpellRepositoryInterface {
  getAll(language: string);
  getDetailsById(language: string, summonerSpellId: string);
  updateAll(language: string, summonerSpell: SummonerSpellDto[]);
  save(language: string, summonerSpell: SummonerSpellDto);
}
