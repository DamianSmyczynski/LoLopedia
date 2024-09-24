import { Injectable } from '@nestjs/common';
import { ItemDto, ItemStat } from '../../items/item.dto';

@Injectable()
export class ItemStatsService {
  public createItemsWithStats(items: ItemDto[]): ItemDto[] {
    items.forEach((item) => {
      item.stats = this.extractStats(item.description);
    });

    return items;
  }

  private extractStats(description: string): ItemStat[] {
    const pattern = /<attention>(.*?)<\/attention>(?:\s*([^<]*))?/g;
    const stats: ItemStat[] = [];
    let match;

    while ((match = pattern.exec(description)) !== null) {
      const value = match[1].trim();
      const name = (match[2] || '').trim();
      if (value && name) {
        stats.push({ name, value });
      }
    }

    return stats;
  }
}
