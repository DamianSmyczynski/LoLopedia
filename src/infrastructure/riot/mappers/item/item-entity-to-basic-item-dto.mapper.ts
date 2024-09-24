import { ItemEntity } from '../../../../items/item.entity';
import { BasicItemDto } from '../../../../items/item.dto';

export class ItemEntityToBasicItemDtoMapper {
  public static map(champion: ItemEntity): BasicItemDto {
    return {
      version: champion.version,
      id: champion.id,
      name: champion.name,
      category: champion.category,
    };
  }
}
