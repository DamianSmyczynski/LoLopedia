import { BasicItemDto, ItemDto } from '../../../../items/item.dto';

export class ItemDtoToBasicItemDtoMapper {
  public static map(item: ItemDto): BasicItemDto {
    return {
      id: item.id,
      name: item.name,
      version: item.version,
      category: item.category,
    };
  }
}
