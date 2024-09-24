import { AugmentDto } from '../../../../augments/augment.dto';

export class HttpRiotAugmentResponseToAugmentDtoMapper {
  public static map(language: string, augment: any): AugmentDto {
    return {
      id: augment.id,
      language: language,
      name: augment.name,
      iconSmallUrl: augment.iconSmall,
      iconLargeUrl: augment.iconLarge,
    };
  }
}
