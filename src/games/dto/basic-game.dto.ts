import { BasicParticipantDto } from './basic-participant.dto';
import { MainParticipantDto } from './main-participant.dto';

export type BasicGameDto = {
  server: string;
  gameDate: Date;
  gameMode: string;
  gameType: string;
  mainBasicParticipant: MainParticipantDto;
  otherBasicParticipants: BasicParticipantDto[];
  mainParticipantItems: number[];
  blueTeamKDA: TeamKDA;
  redTeamKDA: TeamKDA;
  gameDurationTime: number;
  win: boolean;
};

export type TeamKDA = {
  kills: number;
  deaths: number;
  assists: number;
};
