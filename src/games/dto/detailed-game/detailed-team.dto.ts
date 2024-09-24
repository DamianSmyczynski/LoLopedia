import { BanDto } from '../riot-http-game/ban.dto';
import { ObjectivesDto } from '../riot-http-game/objectives.dto';
import { DetailedParticipantDto } from './detailed-participant.dto';

export type DetailedTeamDto = {
  bans: BanDto[];
  objectives: ObjectivesDto;
  participants: DetailedParticipantDto[];
};
