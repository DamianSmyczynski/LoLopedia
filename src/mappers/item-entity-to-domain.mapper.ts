import { Item } from 'src/domain/item';
import { ItemEntity } from 'src/items/item.entity';

export class ItemEntityToDomainMapper {
  public static map(item: ItemEntity): Item {
    return {} as Item;
  }
}
