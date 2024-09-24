import {
  BasicChampionSpell,
  ChampionDto,
  ChampionInfo,
  ChampionSkin,
  ChampionSpell,
  ChampionStats,
} from '../../../../champions/champion.dto';
import { Image } from '../../../../image.type';

export class HttpRiotChampionResponseToChampionDtoMapper {
  public static map(
    language: string,
    champion: {
      key: string;
      blurb: string;
      id: string;
      image: Image;
      info: ChampionInfo;
      lore: string;
      name: string;
      partype: string;
      passive: BasicChampionSpell;
      skins: ChampionSkin[];
      stats: ChampionStats;
      tags: string[];
      title: string;
      spells: ChampionSpell[];
    },
    version: string,
  ): ChampionDto {
    return {
      language: language,
      version: version,
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
    };
  }
}
