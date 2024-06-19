import { Controller, Post, Param, Get } from '@nestjs/common';
import { ItemDto } from 'src/items/item.dto';
import { ItemsService } from 'src/services/item.service';

@Controller('api/:language/items')
export class ItemController {
  constructor(private readonly itemsService: ItemsService) {}

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
}
