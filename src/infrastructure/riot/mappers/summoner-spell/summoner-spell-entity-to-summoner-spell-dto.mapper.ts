import { SummonerSpellDto } from '../../../../summoner-spells/summoner-spell.dto';
import { SummonerSpellEntity } from '../../../../summoner-spells/summoner-spell.entity';

export class SummonerSpellEntityToSummonerSpellDtoMapper {
  public static map(summonerSpell: SummonerSpellEntity): SummonerSpellDto {
    return {
      id: summonerSpell.id,
      language: summonerSpell.language,
      name: summonerSpell.name,
      url: summonerSpell.url,
    };
  }
}
