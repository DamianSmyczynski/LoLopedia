import { RuneDto } from '../../../../runes/rune.dto';

export class HttpRiotRuneResponseToRuneDtoMapper {
  public static map(language: string, rune: any): RuneDto {
    return {
      id: rune.id,
      language: language,
      name: rune.name,
      iconUrl: rune.icon,
    };
  }
}
