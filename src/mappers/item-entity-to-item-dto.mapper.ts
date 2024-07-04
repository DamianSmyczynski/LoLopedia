import { ItemEntity } from 'src/items/Item.entity';
import { ItemDto } from 'src/items/Item.dto';

export class ItemEntityToItemDtoMapper {
  public static map(item: ItemEntity): ItemDto {
    return {
      id: item.id,
      name: item.name,
      version: item.version,
      language: item.language,
      description: item.description,
      colloq: item.colloq,
      from: item.from,
      into: item.into,
      image: item.image,
      gold: item.gold,
      tags: item.tags,
      maps: item.maps,
      category: item.category,
      inStore: item.inStore,
      depth: item.depth,
      requiredChampion: item.requiredChampion,
      plaintext: item.plaintext,
      stats: item.stats,
    };
  }
}
