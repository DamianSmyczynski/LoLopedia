import { Controller, Post, Param, Get } from '@nestjs/common';
import { ItemDto } from 'src/items/item.dto';
import { ItemService } from 'src/services/item/item.service';

@Controller('api/:language/items')
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
