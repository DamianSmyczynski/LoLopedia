import { ItemEntity } from '../../../items/item.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicItemDto, ItemDto } from '../../../items/item.dto';
import { RiotItemRepositoryInterface } from '../interfaces/riot-item-repository.interface';
import { ItemNotFoundError } from '../../../errors/item-not-found.error';
import {
  ItemEntityToBasicItemDtoMapper,
  ItemEntityToItemDtoMapper,
  ItemDtoToItemEntityMapper,
} from '../mappers/item';

@Injectable()
export class MySqlRiotItemService implements RiotItemRepositoryInterface {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  public async getAllItems(language: string): Promise<BasicItemDto[]> {
    const items: BasicItemDto[] = (
      await this.itemRepository.findBy({
        language: language,
      })
    ).map(ItemEntityToBasicItemDtoMapper.map);

    return items;
  }

  public async getItemDetails(
    language: string,
    itemId: string,
  ): Promise<ItemDto> {
    if (+itemId === 0) {
      return null;
    }
    const item: ItemEntity = await this.itemRepository.findOneBy({
      id: itemId,
      language: language,
    });

    if (!item) {
      throw new ItemNotFoundError(itemId);
    }

    const itemDetails = ItemEntityToItemDtoMapper.map(item);

    return itemDetails;
  }

  public async updateAllItems(language: string, items: ItemDto[]) {
    for (const [key, value] of Object.entries(items)) {
      const uniqueId = value.id + '_' + language;
      await this.itemRepository.save({
        unique_id: uniqueId,
        ...value,
      });
    }

    console.log('Data updated!');
  }

  public async saveItem(language: string, item: ItemDto) {
    const uniqueId = item.id + '_' + language;
    await this.itemRepository.save(
      ItemDtoToItemEntityMapper.map(uniqueId, item),
    );
  }
}
