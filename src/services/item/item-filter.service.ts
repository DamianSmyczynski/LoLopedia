import { ItemDto } from 'src/items/item.dto';
import { ItemAvailabilityExceptions } from 'src/item-availability-exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemFilterService {
  public filterItemsByAvailability(items: ItemDto[]): ItemDto[] {
    items.forEach((item) => {
      const exception = ItemAvailabilityExceptions.find(
        (exception) => exception.id === item.id,
      );
      if (exception) {
        item.inStore = exception.inStore;
      }
    });

    const availableItems = items
      .filter((item) => item.inStore)
      .filter((item) => item.id.length <= 5 && item.maps['11'] === true);

    return this.filterItemIntoList(availableItems);
  }

  private filterItemIntoList(items: ItemDto[]): ItemDto[] {
    items.forEach((itemToUpdate) => {
      if (itemToUpdate.into) {
        itemToUpdate.into = itemToUpdate.into.filter((intoItemId) => {
          return items.find((item) => item.id === intoItemId) ? true : false;
        });
      }
    });

    return items;
  }
}
