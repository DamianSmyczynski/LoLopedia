import { AugmentDto } from 'src/augments/augment.dto';
import { RuneDto } from '../../../runes/rune.dto';
import { BasicParticipantDto } from '../basic-game/basic-participant.dto';
import { ItemOnTimelineDto } from '../timeline/item-on-timeline.dto';
import { SkillOnTimeLineDto } from '../timeline/skill-on-timeline.dto';
import { BasicItemDto } from '../../../items/item.dto';
import { SummonerSpellDto } from 'src/summoner-spells/summoner-spell.dto';

export type DetailedParticipantDto = BasicParticipantDto & {
  augments: AugmentDto[];
  detectorWardsPlaced: number;
  goldEarned: number;
  items: BasicItemDto[];
  itemsTimeline: ItemOnTimelineDto[];
  KDA: number;
  killsAchievment: string;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  runes: DetailedParticipantRunesDto;
  skillsTimeline: SkillOnTimeLineDto[];
  summonerSpell1: SummonerSpellDto;
  summonerSpell2: SummonerSpellDto;
  teamId: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalMinionsKilled: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  visionScore: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
};

export type DetailedParticipantRunesDto = {
  primaryRunes: RuneDto[];
  subRunes: RuneDto[];
};
