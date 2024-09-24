import { Injectable } from '@nestjs/common';
import { RiotAccountRepositoryInterface } from '../interfaces/riot-account-repository.interface';
import { AccountDto } from '../../../accounts/dto/account.dto';
import { AccountEntity } from '../../../accounts/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpRiotService } from '../http-riot.service';
import {
  AccountDtoToAccountEntityMapper,
  AccountEntityToAccountDtoMapper,
} from '../mappers/account';

@Injectable()
export class MySqlRiotAccountService implements RiotAccountRepositoryInterface {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async getDetails(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<AccountDto> {
    let account: AccountEntity = await this.accountRepository.findOneBy({
      region: region,
      simplified_game_name: gameName,
      simplified_tag_line: tagLine,
    });

    if (!account) {
      const accountDetails = await this.httpRiotService.getAccount(
        region,
        gameName,
        tagLine,
      );

      account = AccountDtoToAccountEntityMapper.map(accountDetails);

      await this.save(accountDetails);
      return accountDetails;
    }
    return AccountEntityToAccountDtoMapper.map(account);
  }

  public async save(account: AccountDto) {
    await this.accountRepository.save(
      AccountDtoToAccountEntityMapper.map(account),
    );
  }
}
