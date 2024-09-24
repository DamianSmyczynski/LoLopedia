import { ItemDto } from '../../../../items/item.dto';

export class HttpRiotItemResponseToItemDtoMapper {
  public static map(
    language: string,
    version: string,
    itemId: string,
    item: any,
  ): ItemDto {
    return {
      id: itemId,
      category: item.category,
      colloq: item.colloq,
      depth: item.depth,
      description: JSON.stringify(item.description),
      gold: item.gold,
      name: item.name,
      language: language,
      version: version,
      from: item.from,
      into: item.into,
      image: item.image,
      tags: item.tags,
      maps: item.maps,
      specialRecipe: item.specialRecipe,
      inStore: item.inStore !== undefined ? item.inStore : true,
      requiredChampion:
        item.requiredChampion !== undefined ? item.requiredChampion : null,
      plaintext: item.plaintext,
      stats: item.stats,
    };
  }
}
