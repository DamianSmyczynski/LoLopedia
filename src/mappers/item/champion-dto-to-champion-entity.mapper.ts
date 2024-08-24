import { ChampionEntity } from 'src/champions/champion.entity';
import { ChampionDto } from 'src/champions/champion.dto';

export class ChampionDtoToChampionEntityMapper {
  public static map(uniqueId: string, champion: ChampionDto): ChampionEntity {
    return ChampionEntity.create({
      unique_id: uniqueId,
      language: champion.language,
      version: champion.version,
      key: champion.key,
      blurb: champion.blurb,
      id: champion.id,
      image: champion.image,
      info: champion.info,
      lore: JSON.stringify(champion.lore),
      name: champion.name,
      partype: champion.partype,
      passive: champion.passive,
      skins: champion.skins,
      spells: champion.spells,
      stats: champion.stats,
      tags: champion.tags,
      title: champion.title,
    });
  }
}
