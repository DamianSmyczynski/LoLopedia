import { ItemEntity } from 'src/items/item.entity';
import { BasicItemDto } from 'src/items/item.dto';

export class ItemEntityToBasicItemDtoMapper {
  public static map(champion: ItemEntity): BasicItemDto {
    return {
      id: champion.id,
      name: champion.name,
    };
  }
}
