import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from 'src/app.symbol';
import 'dotenv/config';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';
import { RiotAccountRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-account-repository.interface';
import { AccountDto } from 'src/accounts/dto/account.dto';
import { ReloadStatus } from 'src/reload-status.type';

@Injectable()
export class AccountService {
  reloadDelayInMinutes: number = 1;

  constructor(
    @Inject(AppSymbol.RiotAccountRepository)
    private readonly riotRepository: RiotAccountRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async getDetails(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.riotRepository.getDetails(
        region,
        gameName,
        tagLine,
      );

      return account;
    } catch (error) {
      const accountDetails = await this.httpRiotService.getAccount(
        region,
        gameName,
        tagLine,
      );

      try {
        await this.riotRepository.save(accountDetails);
      } catch (error) {
        console.error(error);
      } finally {
        return accountDetails;
      }
    }
  }

  public async reloadDetails(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<ReloadStatus> {
    try {
      const account = await this.riotRepository.getDetails(
        region,
        gameName,
        tagLine,
      );

      if (
        this.isReloadAvailable(
          account.lastReloadDate,
          this.reloadDelayInMinutes,
        )
      ) {
        const actualAccountDetails = await this.httpRiotService.getAccount(
          region,
          gameName,
          tagLine,
        );

        try {
          await this.riotRepository.save(actualAccountDetails);
          return { status: 'reloaded' };
        } catch (error) {
          console.error(error);
        }
      } else {
        return {
          status: 'cooldown',
          cooldown: this.calculateSecondsToReload(
            account.lastReloadDate,
            this.reloadDelayInMinutes,
          ),
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  private isReloadAvailable(
    lastReloadDate: Date,
    delayInMinutes: number,
  ): boolean {
    const now = new Date();

    const timeToLastReload = now.getTime() - lastReloadDate.getTime();

    const requiredDelayTime = delayInMinutes * 60 * 1000;

    return timeToLastReload >= requiredDelayTime;
  }

  private calculateSecondsToReload(
    lastReloadDate: Date,
    delayInMinutes: number,
  ): number {
    const now = new Date();

    const lastReloadTime = (now.getTime() - lastReloadDate.getTime()) / 1000;

    const requiredDelayTime = delayInMinutes * 60;

    return Math.ceil(requiredDelayTime - lastReloadTime);
  }
}
