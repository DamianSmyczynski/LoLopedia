import { Controller, Post, Param, Get } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { ItemDto } from '../items/item.dto';
import { ItemService } from '../services/item/item.service';

@Controller(':language/items')
export class ItemController {
  constructor(private readonly itemsService: ItemService) {}

  @Post('update-items-data')
  async updateItemsData(@Param('language') language: string) {
    await this.itemsService.updateItemsData(language);
  }

  @Get('')
  async getAllItems(@Param('language') language: string): Promise<ItemDto[]> {
    return await this.itemsService.getAllItems(language);
  }

  @Get(':item')
  @ErrorMapper()
  async getItemDetails(
    @Param('language') language: string,
    @Param('item') itemId: string,
  ): Promise<ItemDto> {
    return await this.itemsService.getItemDetails(language, itemId);
  }

  @Get(':item/build-tree')
  async getItemBuildTree(
    @Param('language') language: string,
    @Param('item') itemId: string,
  ): Promise<any[]> {
    return await this.itemsService.getItemBuildTree(language, itemId);
  }
}
