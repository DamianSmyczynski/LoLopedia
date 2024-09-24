import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuneEntity } from '../../../runes/rune.entity';
import { RiotRuneRepositoryInterface } from '../interfaces/riot-rune-repository.interface';
import { RuneDto } from '../../../runes/rune.dto';
import { RuneNotFoundError } from '../../../errors/rune-not-found.error';
import {
  RuneEntityToRuneDtoMapper,
  RuneDtoToRuneEntityMapper,
} from '../mappers/rune';

@Injectable()
export class MySqlRiotRuneService implements RiotRuneRepositoryInterface {
  constructor(
    @InjectRepository(RuneEntity)
    private readonly runeRepository: Repository<RuneEntity>,
  ) {}

  public async getAll(language: string): Promise<RuneDto[]> {
    const runes: RuneDto[] = (
      await this.runeRepository.findBy({
        language: language,
      })
    ).map(RuneEntityToRuneDtoMapper.map);

    return runes;
  }

  public async getDetailsById(
    language: string,
    runeId: string,
  ): Promise<RuneDto> {
    if (+runeId === 0) {
      return null;
    }

    const rune: RuneEntity = await this.runeRepository.findOneBy({
      id: runeId,
      language: language,
    });

    if (!rune) {
      throw new RuneNotFoundError(runeId);
    }

    const runeDetails = RuneEntityToRuneDtoMapper.map(rune);

    return runeDetails;
  }

  public async updateAll(language: string, runes: RuneDto[]) {
    for (const [key, value] of Object.entries(runes)) {
      const uniqueId = value.id + '_' + language;
      await this.runeRepository.save({
        unique_id: uniqueId,
        language: language,
        ...value,
      });
    }

    console.log('Data updated!');
  }

  public async save(language: string, rune: RuneDto) {
    const uniqueId = rune.id + '_' + language;
    await this.runeRepository.save(
      RuneDtoToRuneEntityMapper.map(uniqueId, language, rune),
    );
  }
}
