import { RuneDto } from '../../../runes/rune.dto';

export interface RiotRuneRepositoryInterface {
  getAll(language: string);
  getDetailsById(language: string, runeId: string);
  updateAll(language: string, runes: RuneDto[]);
  save(language: string, rune: RuneDto);
}
