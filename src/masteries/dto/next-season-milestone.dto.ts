import { RewardConfigDto } from './reward-config.dto';

export type NextSeasonMilestoneDto = {
  requireGradeCounts: {
    [grade: string]: number;
  };
  rewardMarks: number;
  bonus: boolean;
  rewardConfig: RewardConfigDto;
  totalGamesRequires: number;
};
