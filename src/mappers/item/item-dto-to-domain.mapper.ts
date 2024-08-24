import { Item } from 'src/domain/item';
import { ItemDto } from 'src/items/item.dto';

export class ItemDtoToDomainMapper {
  public static map(item: ItemDto): Item {
    return {} as Item;
  }
}
