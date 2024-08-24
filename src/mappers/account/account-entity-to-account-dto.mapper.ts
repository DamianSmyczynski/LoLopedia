import { AccountDto } from 'src/accounts/dto/account.dto';
import { AccountEntity } from 'src/accounts/account.entity';

export class AccountEntityToAccountDtoMapper {
  public static map(account: AccountEntity): AccountDto {
    return {
      puuid: account.puuid,
      region: account.region,
      gameName: account.game_name,
      simplifiedGameName: account.simplified_game_name,
      tagLine: account.tag_line,
      simplifiedTagLine: account.simplified_tag_line,
      summonerLevel: account.summoner_level,
      profileIconId: account.profile_icon_id,
      soloQueueRank: account.solo_queue_rank,
      flexQueueRank: account.flex_queue_rank,
      lastReloadDate: account.last_reload_date,
    };
  }
}
