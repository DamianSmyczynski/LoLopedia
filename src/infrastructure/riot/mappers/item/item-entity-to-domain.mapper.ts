import { Item } from '../../../../domain/item';
import { ItemEntity } from '../../../../items/item.entity';

export class ItemEntityToDomainMapper {
  public static map(item: ItemEntity): Item {
    return {} as Item;
  }
}
