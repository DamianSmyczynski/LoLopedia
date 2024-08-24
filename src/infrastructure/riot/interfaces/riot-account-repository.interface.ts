import { AccountDto } from 'src/accounts/dto/account.dto';

export interface RiotAccountRepositoryInterface {
  getDetails(region: string, gameName: string, tagLine: string);
  save(account: AccountDto);
}
