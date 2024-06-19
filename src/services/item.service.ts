import { Injectable, Inject } from '@nestjs/common';
import { AppSymbol } from 'src/app.symbol';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';
import { RiotItemRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-item-repository.interface';
import { ItemCategory } from 'src/item-categories-enum';
import { ItemsCategoryExceptions } from 'src/items-category-exceptions';
import { ItemDto } from 'src/items/item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(AppSymbol.RiotItemRepository)
    private readonly riotRepository: RiotItemRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async updateItemsData(language: string) {
    const items = await this.httpRiotService.getAllItems(language);
    const filteredItems = this.filterFetchedItems(items);
    const categorizedItems = this.categorizeItems(filteredItems);
    await this.riotRepository.updateAllItems(language, categorizedItems);
  }

  public async getAllItems(language: string): Promise<ItemDto[]> {
    return this.riotRepository.getAllItems(language);
  }

  public async getItemDetails(
    language: string,
    itemId: string,
  ): Promise<ItemDto> {
    const item = await this.riotRepository.getItemDetails(language, itemId);

    const newestPatch = await this.httpRiotService.getNewestPatch();

    if (item.version !== newestPatch) {
      try {
        await this.updateItemsData(language);
      } catch (error) {
        console.error(error);
      }
    }
    return item;
  }

  private filterFetchedItems(items: ItemDto[]): ItemDto[] {
    const availableItems = items.filter((item) => item.inStore);
    return availableItems.filter(
      (item) => item.id.length <= 5 && item.maps['11'] === true,
    );
  }

  private categorizeItems(items: ItemDto[]): ItemDto[] {
    const categorizedItems = items.map((item) => {
      if (this.isConsumableItem(item)) {
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
      } else item.category = ItemCategory.Epic;
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
