import { Injectable } from '@nestjs/common';
import { RiotAccountRepositoryInterface } from '../interfaces/riot-account-repository.interface';
import { AccountDto } from 'src/accounts/dto/account.dto';
import { AccountEntity } from 'src/accounts/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountNotFoundError } from 'src/errors/account-not-found.error';
import { AccountEntityToAccountDtoMapper } from 'src/mappers/account/account-entity-to-account-dto.mapper';
import { AccountDtoToAccountEntityMapper } from 'src/mappers/account/account-dto-to-account-entity.mapper';

@Injectable()
export class MySqlRiotAccountService implements RiotAccountRepositoryInterface {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public async getDetails(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<AccountDto> {
    const account: AccountEntity = await this.accountRepository.findOneBy({
      region: region,
      simplified_game_name: gameName,
      simplified_tag_line: tagLine,
    });

    if (!account) {
      throw new AccountNotFoundError(gameName);
    }

    const accountDetails = AccountEntityToAccountDtoMapper.map(account);

    return accountDetails;
  }

  public async save(account: AccountDto) {
    await this.accountRepository.save(
      AccountDtoToAccountEntityMapper.map(account),
    );
  }
}
