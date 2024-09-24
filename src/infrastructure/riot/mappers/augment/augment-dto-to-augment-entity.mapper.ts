import { AugmentDto } from '../../../../augments/augment.dto';
import { AugmentEntity } from '../../../../augments/augment.entity';

export class AugmentDtoToAugmentEntityMapper {
  public static map(
    uniqueId: string,
    language: string,
    augment: AugmentDto,
  ): AugmentEntity {
    return AugmentEntity.create({
      unique_id: uniqueId,
      id: augment.id,
      language: language,
      name: augment.name,
      iconSmallUrl: augment.iconSmallUrl,
      iconLargeUrl: augment.iconLargeUrl,
    });
  }
}
