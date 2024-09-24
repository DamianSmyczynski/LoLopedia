import { Controller, Get, Param } from '@nestjs/common';
import { AccountDto } from '../accounts/dto/account.dto';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { InvalidGameNameStructureError } from '../errors/invalid-game-name.error';
import { ReloadStatus } from '../reload-status.type';
import { AccountService } from '../services/account/account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':region/:gameNameTagLine')
  @ErrorMapper()
  async getAccount(
    @Param('region') region: string,
    @Param('gameNameTagLine') gameNameTagLine: string,
  ): Promise<AccountDto> {
    if (!gameNameTagLine.includes('-')) {
      throw new InvalidGameNameStructureError();
    }
    const [gameName, tagLine] = gameNameTagLine.split('-');
    return this.accountService.getDetails(region, gameName, tagLine);
  }

  @Get(':region/:gameNameTagLine/reload')
  @ErrorMapper()
  async reloadDetails(
    @Param('region') region: string,
    @Param('gameNameTagLine') gameNameTagLine: string,
  ): Promise<ReloadStatus> {
    if (!gameNameTagLine.includes('-')) {
      throw new InvalidGameNameStructureError();
    }
    const [gameName, tagLine] = gameNameTagLine.split('-');
    return this.accountService.reloadDetails(region, gameName, tagLine);
  }
}
