import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { RiotItemRepositoryInterface } from '../../infrastructure/riot/interfaces/riot-item-repository.interface';
import { ItemDto } from '../../items/item.dto';
import { ItemFilterService } from './item-filter.service';
import { ItemCategoryService } from './item-category.service';
import { ItemStatsService } from './item-stats.service';
import { ItemBuildTreeService } from './item-build-tree.service';
import { PatchVersionService } from '../patch-version/patch-version.service';
import { AppSymbol } from '../../app.symbol';

@Injectable()
export class ItemService {
  constructor(
    @Inject(AppSymbol.RiotItemRepository)
    private readonly riotRepository: RiotItemRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
    private readonly patchVersionService: PatchVersionService,
    private readonly filterService: ItemFilterService,
    private readonly categoryService: ItemCategoryService,
    private readonly statsService: ItemStatsService,
    @Inject(forwardRef(() => ItemBuildTreeService))
    private readonly buildTreeService: ItemBuildTreeService,
  ) {}

  public async updateItemsData(language: string) {
    const newestPatch = await this.patchVersionService.getNewest();

    const items = await this.httpRiotService.getAllItems(language, newestPatch);

    const filteredItems = this.filterService.filterItemsByAvailability(items);

    const categorizedItems =
      this.categoryService.categorizeItems(filteredItems);

    const itemsWithStats =
      this.statsService.createItemsWithStats(categorizedItems);

    await this.riotRepository.updateAllItems(language, itemsWithStats);
  }

  public async getAllItems(language: string): Promise<ItemDto[]> {
    return this.riotRepository.getAllItems(language);
  }

  public async getItemDetails(
    language: string,
    itemId: string,
  ): Promise<ItemDto> {
    const item = await this.riotRepository.getItemDetails(language, itemId);

    const newestPatch = await this.patchVersionService.getNewest();

    if (item.version !== newestPatch) {
      try {
        await this.updateItemsData(language);
      } catch (error) {
        throw error;
      }
    }
    return item;
  }

  public async getItemBuildTree(language: string, itemId: string) {
    return this.buildTreeService.buildItemTree(language, itemId);
  }
}
