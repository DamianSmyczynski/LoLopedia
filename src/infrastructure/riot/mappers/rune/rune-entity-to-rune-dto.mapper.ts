import { RuneEntity } from '../../../../runes/rune.entity';
import { RuneDto } from '../../../../runes/rune.dto';

export class RuneEntityToRuneDtoMapper {
  public static map(rune: RuneEntity): RuneDto {
    return {
      id: rune.id,
      language: rune.language,
      name: rune.name,
      iconUrl: rune.iconUrl,
    };
  }
}
