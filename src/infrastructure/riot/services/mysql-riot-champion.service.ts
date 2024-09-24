import { Injectable } from '@nestjs/common';
import { RiotChampionRepositoryInterface } from '../interfaces/riot-champion-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChampionEntity } from '../../../champions/champion.entity';
import { Repository } from 'typeorm';
import { BasicChampionDto, ChampionDto } from '../../../champions/champion.dto';
import { ChampionNotFoundError } from '../../../errors/champion-not-found.error';
import {
  ChampionEntityToBasicChampionDtoMapper,
  ChampionEntityToChampionDtoMapper,
  ChampionDtoToChampionEntityMapper,
} from '../mappers/champion';

@Injectable()
export class MySqlRiotChampionService
  implements RiotChampionRepositoryInterface
{
  constructor(
    @InjectRepository(ChampionEntity)
    private readonly championRepository: Repository<ChampionEntity>,
  ) {}

  public async getAllChampions(language: string): Promise<BasicChampionDto[]> {
    const champions: BasicChampionDto[] = (
      await this.championRepository.findBy({
        language: language,
      })
    ).map(ChampionEntityToBasicChampionDtoMapper.map);

    return champions;
  }

  public async getChampionDetailsById(
    language: string,
    championId: string,
  ): Promise<ChampionDto> {
    const champion: ChampionEntity = await this.championRepository.findOneBy({
      key: championId,
      language: language,
    });

    if (!champion) {
      throw new ChampionNotFoundError(championId);
    }

    const championDetails = ChampionEntityToChampionDtoMapper.map(champion);

    return championDetails;
  }

  public async getChampionDetailsByName(
    language: string,
    championName: string,
  ): Promise<ChampionDto> {
    const champion: ChampionEntity = await this.championRepository.findOneBy({
      id: championName,
      language: language,
    });

    if (!champion) {
      throw new ChampionNotFoundError(championName);
    }

    const championDetails = ChampionEntityToChampionDtoMapper.map(champion);

    return championDetails;
  }

  public async updateAllChampions(language: string, champions: ChampionDto[]) {
    for (const [key, value] of Object.entries(champions)) {
      const uniqueId = value.id + '_' + language;
      await this.championRepository.save({
        unique_id: uniqueId,
        language: language,
        ...value,
      });
    }

    console.log('Data updated!');
  }

  public async saveChampion(language: string, champion: ChampionDto) {
    const uniqueId = champion.id + '_' + language;
    await this.championRepository.save(
      ChampionDtoToChampionEntityMapper.map(uniqueId, champion),
    );
  }
}
