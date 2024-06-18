import { Image } from 'src/image.type';
import { ItemDto, ItemGold } from 'src/items/item.dto';

export class HttpRiotItemResponseToItemDtoMapper {
  public static map(
    language: string,
    version: string,
    itemId: string,
    item: any,
  ): ItemDto {
    return {
      id: itemId,
      name: item.name,
      language: language,
      version: version,
      description: JSON.stringify(item.description),
      colloq: item.colloq,
      from: item.from,
      into: item.into,
      image: item.image,
      gold: item.gold,
      tags: item.tags,
      maps: item.maps,
      inStore: item.inStore !== undefined ? item.inStore : true,
      depth: item.depth,
    };
  }
}
