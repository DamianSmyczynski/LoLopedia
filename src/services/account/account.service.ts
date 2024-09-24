import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from '../../app.symbol';
import 'dotenv/config';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { RiotAccountRepositoryInterface } from '../../infrastructure/riot/interfaces/riot-account-repository.interface';
import { AccountDto } from '../../accounts/dto/account.dto';
import { ReloadStatus } from '../../reload-status.type';

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
    const account = await this.riotRepository.getDetails(
      region,
      gameName,
      tagLine,
    );

    return account;
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
          throw error;
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
      throw error;
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
