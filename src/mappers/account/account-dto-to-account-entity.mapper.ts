import { AccountDto } from 'src/accounts/dto/account.dto';
import { AccountEntity } from 'src/accounts/account.entity';

export class AccountDtoToAccountEntityMapper {
  public static map(account: AccountDto): AccountEntity {
    return AccountEntity.create({
      puuid: account.puuid,
      region: account.region,
      game_name: account.gameName,
      simplified_game_name: account.simplifiedGameName,
      tag_line: account.tagLine,
      simplified_tag_line: account.simplifiedTagLine,
      summoner_level: account.summonerLevel,
      profile_icon_id: account.profileIconId,
      solo_queue_rank: account.soloQueueRank,
      flex_queue_rank: account.flexQueueRank,
      last_reload_date: account.lastReloadDate,
    });
  }
}
