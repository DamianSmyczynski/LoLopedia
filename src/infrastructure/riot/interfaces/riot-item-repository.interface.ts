import { ItemDto } from 'src/items/item.dto';

export interface RiotItemRepositoryInterface {
  getAllItems(language: string);
  getItemDetails(language: string, itemName: string);
  updateAllItems(language: string, items: ItemDto[]);
  saveItem(language: string, Item: ItemDto);
}
