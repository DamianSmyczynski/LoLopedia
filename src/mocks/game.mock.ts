import { GameDto } from '../games/dto/riot-http-game/game.dto';
import { InfoDto } from '../games/dto/riot-http-game/info.dto';
import { ParticipantDto } from '../games/dto/riot-http-game/participant.dto';
import { mockParticipant } from './participant.mock';
import { blueTeamMock, redTeamMock } from './teams.mock';

export const mockGame: GameDto = {
  metadata: {
    matchId: 'mock-match-id',
    dataVersion: 'mock-data-version',
    participants: [],
  },
  info: {
    gameStartTimestamp: Date.now(),
    gameEndTimestamp: Date.now() + 1800000,
    gameMode: 'CLASSIC',
    gameDuration: 1800,
    participants: [mockParticipant as ParticipantDto],
    queueId: 400,
    teams: [blueTeamMock, redTeamMock],
  } as InfoDto,
};
