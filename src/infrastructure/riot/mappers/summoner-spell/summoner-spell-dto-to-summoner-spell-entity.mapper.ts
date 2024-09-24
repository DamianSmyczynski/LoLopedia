import { SummonerSpellDto } from 'src/summoner-spells/summoner-spell.dto';
import { SummonerSpellEntity } from 'src/summoner-spells/summoner-spell.entity';

export class SummonerSpellDtoToSummonerSpellEntityMapper {
  public static map(
    uniqueId: string,
    language: string,
    summonerSpell: SummonerSpellDto,
  ): SummonerSpellEntity {
    return SummonerSpellEntity.create({
      unique_id: uniqueId,
      id: summonerSpell.id,
      language: language,
      name: summonerSpell.name,
      url: summonerSpell.url,
    });
  }
}
