import { DetailedGameDto } from '../../../../games/dto/detailed-game/detailed-game.dto';
import { mockParticipant } from '../../../../mocks/participant.mock';
import { GameToDetailedGameMapper } from './game-to-detailed-game.mapper';
import { mockGame } from '../../../../mocks/game.mock';
import { ParticipantDto } from '../../../../games/dto/riot-http-game/participant.dto';

describe('GameToDetailedGameMapper', () => {
  it('should correctly map the game data to DetailedGameDto', () => {
    const result: DetailedGameDto = GameToDetailedGameMapper.map(mockGame);

    expect(result.matchId).toBe('mock-match-id');
    expect(result.blueTeam.participants.length).toBe(1);
    expect(result.redTeam.participants.length).toBe(0);
  });

  it('should correctly map blue team data', () => {
    const result: DetailedGameDto = GameToDetailedGameMapper.map(mockGame);
    const blueTeam = result.blueTeam;

    expect(blueTeam.objectives.baron.kills).toBe(1);
    expect(blueTeam.objectives.tower.kills).toBe(3);
    expect(blueTeam.participants[0].championName).toBe('Ahri');
    expect(blueTeam.participants[0].KDA).toBeCloseTo(5.0);
  });

  it('should correctly specify achievement', () => {
    const tripleKillParticipant = mockParticipant;
    tripleKillParticipant.tripleKills = 1;

    const achievement = GameToDetailedGameMapper['specifyAchievment'](
      tripleKillParticipant as ParticipantDto,
    );
    expect(achievement).toBe('Triple Kill');
  });

  it('should return null achievement if no multi-kill', () => {
    const noKillParticipant = mockParticipant;
    noKillParticipant.doubleKills = 0;
    noKillParticipant.tripleKills = 0;
    noKillParticipant.quadraKills = 0;
    noKillParticipant.pentaKills = 0;

    const achievement = GameToDetailedGameMapper['specifyAchievment'](
      noKillParticipant as ParticipantDto,
    );
    expect(achievement).toBeNull();
  });
});
