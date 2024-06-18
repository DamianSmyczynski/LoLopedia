import { ChampionEntity } from 'src/champions/champion.entity';
import { BasicChampionDto } from 'src/champions/champion.dto';

export class ChampionEntityToBasicChampionDtoMapper {
  public static map(champion: ChampionEntity): BasicChampionDto {
    return {
      id: champion.id,
      name: champion.name,
    };
  }
}
