import { DetailedTeamDto } from './detailed-team.dto';

export type DetailedGameDto = {
  matchId: string;
  gameDate: Date;
  gameDurationTime: number;
  gameMode: string;
  gameType: string;
  blueTeam: DetailedTeamDto;
  redTeam: DetailedTeamDto;
  win: string;
};
