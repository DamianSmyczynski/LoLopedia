import { ItemDto } from '../../../../items/item.dto';
import { ItemEntity } from '../../../../items/item.entity';

export class ItemDtoToItemEntityMapper {
  public static map(uniqueId: string, item: ItemDto): ItemEntity {
    return ItemEntity.create({
      unique_id: uniqueId,
      language: item.language,
      version: item.version,
      id: item.id,
      name: item.name,
      from: item.from,
      into: item.into,
      image: item.image,
      gold: item.gold,
      tags: item.tags,
      stats: item.stats,
      plaintext: item.plaintext,
    });
  }
}
