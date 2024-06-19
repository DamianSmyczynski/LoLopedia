import { Injectable } from '@nestjs/common';
import { RiotChampionRepositoryInterface } from '../interfaces/riot-champion-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChampionEntity } from 'src/champions/champion.entity';
import { Repository } from 'typeorm';
import { BasicChampionDto, ChampionDto } from 'src/champions/champion.dto';
import { ChampionEntityToBasicChampionDtoMapper } from 'src/mappers/champion-entity-to-basic-champion-dto.mapper';
import { ChampionEntityToChampionDtoMapper } from 'src/mappers/champion-entity-to-champion-dto.mapper';
import { ChampionDtoToChampionEntityMapper } from 'src/mappers/champion-dto-to-champion-entity.mapper';
import { ChampionNotFoundError } from 'src/errors/champion-not-found.error';

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

  public async getChampionDetails(
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
