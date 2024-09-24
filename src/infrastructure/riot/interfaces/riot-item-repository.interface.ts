import { ItemDto } from '../../../items/item.dto';

export interface RiotItemRepositoryInterface {
  getAllItems(language: string);
  getItemDetails(language: string, itemId: string);
  updateAllItems(language: string, items: ItemDto[]);
  saveItem(language: string, Item: ItemDto);
}
