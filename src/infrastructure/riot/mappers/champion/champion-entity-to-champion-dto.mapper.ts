import { ChampionEntity } from '../../../../champions/champion.entity';
import { ChampionDto } from '../../../../champions/champion.dto';

export class ChampionEntityToChampionDtoMapper {
  public static map(champion: ChampionEntity): ChampionDto {
    return {
      language: champion.language,
      version: champion.version,
      id: champion.id,
      name: champion.name,
      key: champion.key,
      title: champion.title,
      blurb: champion.blurb,
      info: champion.info,
      image: champion.image,
      tags: champion.tags,
      partype: champion.partype,
      stats: champion.stats,
      lore: champion.lore,
      passive: champion.passive,
      skins: champion.skins,
      spells: champion.spells,
    };
  }
}
