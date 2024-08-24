import { BasicParticipantDto } from './basic-participant.dto';
import { PerksDto } from './perks.dto';

export type MainParticipantDto = BasicParticipantDto & {
  perks: PerksDto;
  summoner1Id: string;
  summoner2Id: string;
  totalMinionsKilled: number;
  visionScore: number;
};
