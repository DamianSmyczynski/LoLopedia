import { AccountDto } from '../../../../accounts/dto/account.dto';
import { RankDto } from '../../../../accounts/dto/rank.dto';
import { simplifyString } from '../../../../helpers/simplify-string.helper';
export class HttpRiotAccountResponseToAccountDtoMapper {
  public static map(
    riotAccount: any,
    summonerLevel: number,
    profileIconId: number,
    soloQueueRank: RankDto,
    flexQueueRank: RankDto,
    region: string,
  ): AccountDto {
    return {
      puuid: riotAccount.puuid,
      region: region,
      gameName: riotAccount.gameName,
      simplifiedGameName: simplifyString(riotAccount.gameName),
      tagLine: riotAccount.tagLine,
      simplifiedTagLine: simplifyString(riotAccount.tagLine),
      summonerLevel: summonerLevel,
      profileIconId: profileIconId,
      soloQueueRank: soloQueueRank,
      flexQueueRank: flexQueueRank,
      lastReloadDate: new Date(),
    };
  }
}
