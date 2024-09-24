import { AugmentDto } from '../../../augments/augment.dto';

export interface RiotAugmentRepositoryInterface {
  getAll(language: string);
  getDetailsById(language: string, augmentId: string);
  updateAll(language: string, augments: AugmentDto[]);
  save(language: string, augment: AugmentDto);
}
