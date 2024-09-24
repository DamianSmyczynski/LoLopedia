import { AugmentDto } from '../../../../augments/augment.dto';
import { AugmentEntity } from '../../../../augments/augment.entity';

export class AugmentEntityToAugmentDtoMapper {
  public static map(augment: AugmentEntity): AugmentDto {
    return {
      id: augment.id,
      language: augment.language,
      name: augment.name,
      iconLargeUrl: augment.iconLargeUrl,
      iconSmallUrl: augment.iconSmallUrl,
    };
  }
}
