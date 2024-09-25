import { BasicItemDto } from 'src/items/item.dto';
import { BasicParticipantDto } from './basic-participant.dto';
import { MainParticipantDto } from './main-participant.dto';

export type BasicGameDto = {
  matchId: string;
  language: string;
  puuid: string;
  server: string;
  gameDate: Date;
  gameDurationTime: number;
  gameMode: string;
  gameType: string;
  mainBasicParticipant: MainParticipantDto;
  otherBasicParticipants: BasicParticipantDto[];
  mainParticipantItems: BasicItemDto[];
  blueTeamKDA: TeamKDA;
  redTeamKDA: TeamKDA;
  win: boolean;
};

export type TeamKDA = {
  kills: number;
  deaths: number;
  assists: number;
};
