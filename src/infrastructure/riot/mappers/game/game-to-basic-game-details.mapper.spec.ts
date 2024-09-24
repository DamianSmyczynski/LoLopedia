import { BasicGameDto } from '../../../../games/dto/basic-game/basic-game.dto';
import { GameDto } from '../../../../games/dto/riot-http-game/game.dto';
import { ParticipantDto } from '../../../../games/dto/riot-http-game/participant.dto';
import { GameToBasicGameDetailsMapper } from './game-to-basic-game-details.mapper';
import { mockParticipant } from '../../../../mocks/participant.mock';
import { mockGame } from '../../../../mocks/game.mock';

describe('GameToBasicGameDetailsMapper', () => {
  const mockSummonerSpellsIds = [
    { id: 'SummonerFlash', key: '1' },
    { id: 'SummonerHeal', key: '2' },
  ];

  it('should correctly map the game data to BasicGameDto', () => {
    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      mockGame,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.server).toBe('EUW');
    expect(result.gameMode).toBe('CLASSIC');
    expect(result.matchId).toBe('mock-match-id');
    expect(result.mainBasicParticipant.championName).toBe('Ahri');
    expect(result.mainBasicParticipant.summoner1Id).toBe('SummonerFlash');
    expect(result.mainBasicParticipant.summoner2Id).toBe('SummonerHeal');
    expect(result.mainParticipantItems).toEqual([
      1056, 1058, 3089, 3135, 3020, 3285, 3364,
    ]);
    expect(result.win).toBe(true);
  });

  it('should correctly calculate blue and red team KDA', () => {
    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      mockGame,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.blueTeamKDA.kills).toBe(10);
    expect(result.redTeamKDA.kills).toBe(0);
  });

  it('should map summoner spells correctly', () => {
    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      mockGame,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.mainBasicParticipant.summoner1Id).toBe('SummonerFlash');
    expect(result.mainBasicParticipant.summoner2Id).toBe('SummonerHeal');
  });

  it('should return correct game duration when gameEndTimestamp is not null', () => {
    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      mockGame,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.gameDurationTime).toBe(1800);
  });

  it('should return game duration in seconds when gameEndTimestamp is null', () => {
    const gameWithNullEndTimestamp = {
      ...mockGame,
      info: { ...mockGame.info, gameEndTimestamp: null },
    };

    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      gameWithNullEndTimestamp,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.gameDurationTime).toBe(1800 / 1000);
  });

  it('should handle multiple participants correctly', () => {
    const otherParticipant: Partial<ParticipantDto> = {
      ...mockParticipant,
      puuid: 'other-puuid',
      summonerName: 'OtherSummoner',
    };

    const gameWithMultipleParticipants = {
      ...mockGame,
      info: {
        ...mockGame.info,
        participants: [mockParticipant, otherParticipant],
      },
    };

    const result: BasicGameDto = GameToBasicGameDetailsMapper.map(
      'EUW',
      gameWithMultipleParticipants as GameDto,
      'mock-puuid',
      mockSummonerSpellsIds,
    );

    expect(result.otherBasicParticipants.length).toBe(1);
    expect(result.otherBasicParticipants[0].summonerName).toBe('OtherSummoner');
  });
});
