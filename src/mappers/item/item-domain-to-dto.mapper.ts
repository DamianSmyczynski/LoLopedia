import { Item } from 'src/domain/item';
import { ItemDto } from 'src/items/item.dto';

export class ItemDomainToDtoMapper {
  public static map(item: Item): ItemDto {
    return {} as ItemDto;
  }
}
