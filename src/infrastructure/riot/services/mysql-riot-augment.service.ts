import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AugmentEntity } from '../../../augments/augment.entity';
import { RiotAugmentRepositoryInterface } from '../interfaces/riot-augment-repository.interface';
import { AugmentDto } from '../../../augments/augment.dto';
import { AugmentNotFoundError } from 'src/errors/augment-not-found.error';
import {
  AugmentEntityToAugmentDtoMapper,
  AugmentDtoToAugmentEntityMapper,
} from '../mappers/augment';

@Injectable()
export class MySqlRiotAugmentService implements RiotAugmentRepositoryInterface {
  constructor(
    @InjectRepository(AugmentEntity)
    private readonly augmentRepository: Repository<AugmentEntity>,
  ) {}

  public async getAll(language: string): Promise<AugmentDto[]> {
    const augments: AugmentDto[] = (
      await this.augmentRepository.findBy({
        language: language,
      })
    ).map(AugmentEntityToAugmentDtoMapper.map);

    return augments;
  }

  public async getDetailsById(
    language: string,
    augmentId: string,
  ): Promise<AugmentDto> {
    if (+augmentId === 0) {
      return null;
    }
    const augment: AugmentEntity = await this.augmentRepository.findOneBy({
      id: augmentId,
      language: language,
    });

    if (!augment) {
      throw new AugmentNotFoundError(augmentId);
    }

    const augmentDetails = AugmentEntityToAugmentDtoMapper.map(augment);

    return augmentDetails;
  }

  public async updateAll(language: string, augments: AugmentDto[]) {
    for (const [key, value] of Object.entries(augments)) {
      const uniqueId = value.id + '_' + language;
      await this.augmentRepository.save({
        unique_id: uniqueId,
        language: language,
        ...value,
      });
    }

    console.log('Data updated!');
  }

  public async save(language: string, augment: AugmentDto) {
    const uniqueId = augment.id + '_' + language;
    await this.augmentRepository.save(
      AugmentDtoToAugmentEntityMapper.map(uniqueId, language, augment),
    );
  }
}
