import { Item } from '../../../../domain/item';
import { ItemDto } from '../../../../items/item.dto';

export class ItemDomainToDtoMapper {
  public static map(item: Item): ItemDto {
    return {} as ItemDto;
  }
}
