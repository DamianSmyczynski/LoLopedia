import { RuneDto } from '../../../../runes/rune.dto';
import { RuneEntity } from '../../../../runes/rune.entity';

export class RuneDtoToRuneEntityMapper {
  public static map(
    uniqueId: string,
    language: string,
    rune: RuneDto,
  ): RuneEntity {
    return RuneEntity.create({
      unique_id: uniqueId,
      id: rune.id,
      language: language,
      name: rune.name,
      iconUrl: rune.iconUrl,
    });
  }
}
