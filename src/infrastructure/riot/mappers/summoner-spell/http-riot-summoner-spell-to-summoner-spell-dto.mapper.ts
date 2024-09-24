import { SummonerSpellDto } from 'src/summoner-spells/summoner-spell.dto';

export class HttpRiotSummonerSpellResponseToSummonerSpellDtoMapper {
  public static map(language: string, summonerSpell: any): SummonerSpellDto {
    return {
      id: summonerSpell.key,
      language: language,
      name: summonerSpell.name,
      url: summonerSpell.id,
    };
  }
}
