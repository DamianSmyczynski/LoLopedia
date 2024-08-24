import { RankDto } from './rank.dto';

export type AccountDto = {
  puuid: string;
  region: string;
  gameName: string;
  simplifiedGameName: string;
  tagLine: string;
  simplifiedTagLine: string;
  summonerLevel: number;
  profileIconId: number;
  soloQueueRank: RankDto;
  flexQueueRank: RankDto;
  lastReloadDate: Date;
};
