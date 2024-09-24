import { ItemDto } from '../../items/item.dto';
import { ItemCategory } from '../../item-categories-enum';
import { ItemsCategoryExceptions } from '../../items-category-exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemCategoryService {
  public categorizeItems(items: ItemDto[]): ItemDto[] {
    const categorizedItems = items.map((item) => {
      if (item.requiredChampion) {
        item.category = ItemCategory.Other;
      } else if (this.isConsumableItem(item)) {
        item.category = ItemCategory.Consumable;
      } else if (this.isTrinketItem(item)) {
        item.category = ItemCategory.Trinket;
      } else if (this.isStarterItem(item)) {
        item.category = ItemCategory.Starter;
      } else if (this.isBootsItem(item)) {
        item.category = ItemCategory.Boots;
      } else if (this.isBasicItem(item)) {
        item.category = ItemCategory.Basic;
      } else if (this.isLegendaryItem(item)) {
        item.category = ItemCategory.Legendary;
      } else {
        item.category = ItemCategory.Epic;
      }
      return item;
    });

    categorizedItems.forEach((item) => {
      const exception = ItemsCategoryExceptions.find(
        (exception) => exception.id === item.id,
      );
      if (exception) {
        item.category = exception.category;
      }
    });

    return categorizedItems;
  }

  private isStarterItem(item: ItemDto): boolean {
    return (
      item.gold.total <= 500 &&
      (!item.from || item.from.length === 0) &&
      (!item.into || item.into.length === 0) &&
      item.tags.some((tag) => ['Jungle', 'Lane'].includes(tag))
    );
  }

  private isConsumableItem(item: ItemDto): boolean {
    return item.tags.includes('Consumable');
  }

  private isTrinketItem(item: ItemDto): boolean {
    return (
      item.tags.includes('Trinket') &&
      item.gold.purchasable &&
      item.gold.base === 0
    );
  }

  private isBasicItem(item: ItemDto): boolean {
    return (!item.from || item.from.length === 0) && item.gold.base <= 2000;
  }

  private isBootsItem(item: ItemDto): boolean {
    return item.tags.some((tag) => ['Boots'].includes(tag));
  }

  private isLegendaryItem(item: ItemDto): boolean {
    return (
      item.depth >= 3 ||
      (item.depth >= 2 && (!item.into || item.into.length === 0)) ||
      item.gold.total >= 3000
    );
  }
}
