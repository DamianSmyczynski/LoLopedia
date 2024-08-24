import { NextSeasonMilestoneDto } from './next-season-milestone.dto';

export type MasteryDto = {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  markRequiredForNextLevel: number;
  tokensEarned: number;
  championSeasonMilestone: number;
  nextSeasonMilestone: NextSeasonMilestoneDto;
};
