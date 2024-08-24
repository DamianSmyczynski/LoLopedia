import { Controller, Get, Param } from '@nestjs/common';
import { AccountDto } from 'src/accounts/dto/account.dto';
import { ErrorMapper } from 'src/decorators/error-mapper.decorator';
import { ReloadStatus } from 'src/reload-status.type';
import { AccountService } from 'src/services/account/account.service';

@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':region/:gameNameTagLine')
  @ErrorMapper()
  async getAccount(
    @Param('region') region: string,
    @Param('gameNameTagLine') gameNameTagLine: string,
  ): Promise<AccountDto> {
    const [gameName, tagLine] = gameNameTagLine.split('-');
    return this.accountService.getDetails(region, gameName, tagLine);
  }

  @Get(':region/:gameNameTagLine/reload')
  @ErrorMapper()
  async reloadDetails(
    @Param('region') region: string,
    @Param('gameNameTagLine') gameNameTagLine: string,
  ): Promise<ReloadStatus> {
    const [gameName, tagLine] = gameNameTagLine.split('-');
    return this.accountService.reloadDetails(region, gameName, tagLine);
  }
}
