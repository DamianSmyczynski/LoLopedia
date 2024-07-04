import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ItemDto } from 'src/items/item.dto';
import { ItemService } from './item.service';

@Injectable()
export class ItemBuildTreeService {
  constructor(
    @Inject(forwardRef(() => ItemService))
    private readonly itemsService: ItemService,
  ) {}

  public async buildItemTree(language: string, itemId: string) {
    const item: ItemDto = await this.itemsService.getItemDetails(
      language,
      itemId,
    );

    let itemBuildTree = [
      {
        id: item.id,
        name: item.name,
        gold: item.gold.total,
        from: item.from ? item.from : [],
      },
    ];

    let itemQueue = item.from ? [...item.from] : [];

    while (itemQueue.length) {
      const currentItemId: string = itemQueue.shift();
      const currentItem: ItemDto = await this.itemsService.getItemDetails(
        language,
        currentItemId,
      );

      if (currentItem.from) {
        itemQueue = itemQueue.concat(currentItem.from);
      }

      if (!itemBuildTree.find((item) => item.id === currentItem.id)) {
        itemBuildTree.push({
          id: currentItem.id,
          name: currentItem.name,
          gold: currentItem.gold.total,
          from: currentItem.from ? currentItem.from : [],
        });
      }
    }

    return itemBuildTree;
  }
}
