import { Item } from '../../../../domain/item';
import { ItemDto } from '../../../../items/item.dto';

export class ItemDtoToDomainMapper {
  public static map(item: ItemDto): Item {
    return {} as Item;
  }
}
