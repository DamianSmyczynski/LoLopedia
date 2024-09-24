import { AccountDto } from '../../../../accounts/dto/account.dto';
import { RankDto } from '../../../../accounts/dto/rank.dto';
import { simplifyString } from '../../../../helpers/simplify-string.helper';
import { HttpRiotAccountResponseToAccountDtoMapper } from '../http-riot-account-response-to-account-dto.mapper';

jest.mock('../../../helpers/simplify-string.helper');

describe('HttpRiotAccountResponseToAccountDtoMapper', () => {
  const mockRiotAccount = {
    puuid: 'mock-puuid',
    gameName: 'MockGameName',
    tagLine: 'MockTagLine',
  };

  const mockSoloQueueRank: Partial<RankDto> = {
    tier: 'Gold',
    rank: 'IV',
    leaguePoints: 50,
    wins: 20,
    losses: 15,
  };

  const mockFlexQueueRank: Partial<RankDto> = {
    tier: 'Silver',
    rank: 'I',
    leaguePoints: 80,
    wins: 30,
    losses: 25,
  };

  const mockRegion = 'NA';

  beforeEach(() => {
    (simplifyString as jest.Mock).mockImplementation((str: string) =>
      str.toLowerCase(),
    );
  });

  it('should correctly map riotAccount to AccountDto', () => {
    const result: AccountDto = HttpRiotAccountResponseToAccountDtoMapper.map(
      mockRiotAccount,
      100,
      1234,
      mockSoloQueueRank as RankDto,
      mockFlexQueueRank as RankDto,
      mockRegion,
    );

    expect(result.puuid).toBe('mock-puuid');
    expect(result.region).toBe(mockRegion);
    expect(result.gameName).toBe('MockGameName');
    expect(result.simplifiedGameName).toBe('mockgamename');
    expect(result.tagLine).toBe('MockTagLine');
    expect(result.simplifiedTagLine).toBe('mocktagline');
    expect(result.summonerLevel).toBe(100);
    expect(result.profileIconId).toBe(1234);
    expect(result.soloQueueRank).toEqual(mockSoloQueueRank);
    expect(result.flexQueueRank).toEqual(mockFlexQueueRank);
    expect(result.lastReloadDate).toBeInstanceOf(Date);
  });

  it('should call simplifyString helper with correct arguments', () => {
    HttpRiotAccountResponseToAccountDtoMapper.map(
      mockRiotAccount,
      100,
      1234,
      mockSoloQueueRank as RankDto,
      mockFlexQueueRank as RankDto,
      mockRegion,
    );

    expect(simplifyString).toHaveBeenCalledWith('MockGameName');
    expect(simplifyString).toHaveBeenCalledWith('MockTagLine');
  });
});
