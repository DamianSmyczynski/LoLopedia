import { AugmentDto } from 'src/augments/augment.dto';
import { BasicParticipantDto } from './basic-participant.dto';
import { RuneDto } from 'src/runes/rune.dto';
import { SummonerSpellDto } from 'src/summoner-spells/summoner-spell.dto';

export type MainParticipantDto = BasicParticipantDto & {
  runes: MainParticipantRunesDto;
  playerAugments: AugmentDto[];
  summonerSpell1: SummonerSpellDto;
  summonerSpell2: SummonerSpellDto;
  totalMinionsKilled: number;
  visionScore: number;
};

export type MainParticipantRunesDto = {
  primaryRune: RuneDto;
  subRune: RuneDto;
};
