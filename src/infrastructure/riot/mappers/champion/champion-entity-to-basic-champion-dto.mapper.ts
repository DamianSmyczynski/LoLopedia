import { ChampionEntity } from '../../../../champions/champion.entity';
import { BasicChampionDto } from '../../../../champions/champion.dto';

export class ChampionEntityToBasicChampionDtoMapper {
  public static map(champion: ChampionEntity): BasicChampionDto {
    return {
      id: champion.id,
      name: champion.name,
    };
  }
}
