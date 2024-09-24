import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SummonerSpellDto } from '../../../summoner-spells/summoner-spell.dto';
import { SummonerSpellEntity } from '../../../summoner-spells/summoner-spell.entity';
import { Repository } from 'typeorm';
import { RiotSummonerSpellRepositoryInterface } from '../interfaces/riot-summoner-spell-repository.interface';
import {
  SummonerSpellEntityToSummonerSpellDtoMapper,
  SummonerSpellDtoToSummonerSpellEntityMapper,
} from '../mappers/summoner-spell';
import { SummonerSpellNotFoundError } from 'src/errors/summoner-spell-not-found.error';

@Injectable()
export class MySqlRiotSummonerSpellService
  implements RiotSummonerSpellRepositoryInterface
{
  constructor(
    @InjectRepository(SummonerSpellEntity)
    private readonly summonerSpellRepository: Repository<SummonerSpellEntity>,
  ) {}

  public async getAll(language: string): Promise<SummonerSpellDto[]> {
    const summonerSpells: SummonerSpellDto[] = (
      await this.summonerSpellRepository.findBy({
        language: language,
      })
    ).map(SummonerSpellEntityToSummonerSpellDtoMapper.map);

    return summonerSpells;
  }

  public async getDetailsById(
    language: string,
    summonerSpellId: string,
  ): Promise<SummonerSpellDto> {
    if (+summonerSpellId === 0) {
      return null;
    }

    const summonerSpell: SummonerSpellEntity =
      await this.summonerSpellRepository.findOneBy({
        id: summonerSpellId,
        language: language,
      });

    if (!summonerSpell) {
      throw new SummonerSpellNotFoundError(summonerSpellId);
    }

    const summonerSpellDetails =
      SummonerSpellEntityToSummonerSpellDtoMapper.map(summonerSpell);

    return summonerSpellDetails;
  }

  public async updateAll(language: string, summonerSpells: SummonerSpellDto[]) {
    for (const [key, value] of Object.entries(summonerSpells)) {
      const uniqueId = value.id + '_' + language;
      await this.summonerSpellRepository.save({
        unique_id: uniqueId,
        language: language,
        ...value,
      });
    }

    console.log('Data updated!');
  }

  public async save(language: string, summonerSpell: SummonerSpellDto) {
    const uniqueId = summonerSpell.id + '_' + language;
    await this.summonerSpellRepository.save(
      SummonerSpellDtoToSummonerSpellEntityMapper.map(
        uniqueId,
        language,
        summonerSpell,
      ),
    );
  }
}
