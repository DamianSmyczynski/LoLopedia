import { Inject, Injectable } from '@nestjs/common';
import { BasicGameDto } from '../../games/dto/basic-game/basic-game.dto';
import { DetailedGameDto } from '../../games/dto/detailed-game/detailed-game.dto';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { AppSymbol } from 'src/app.symbol';
import { RiotGameRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-game-repository.interface';
import * as moment from 'moment';

@Injectable()
export class GameService {
  constructor(
    @Inject(AppSymbol.RiotGameRepository)
    private readonly riotRepository: RiotGameRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async getBasicGamesList(
    language: string,
    gameType: string,
    puuid: string,
    region: string,
    start: number,
  ): Promise<BasicGameDto[]> {
    const latestGamesIdsList = await this.httpRiotService.getGameIdsList(
      puuid,
      region,
      50,
      gameType,
      0,
    );

    await this.riotRepository.updateGameIds(latestGamesIdsList, puuid);

    const latestGamesList: BasicGameDto[] =
      await this.riotRepository.getGamesFromRange(puuid, start, 10);

    for (const game of latestGamesList) {
      if (!game.gameDate) {
        const { basicGameDetails } = await this.httpRiotService.getGameDetails(
          language,
          region,
          game.matchId,
          puuid,
        );
        await this.riotRepository.save(basicGameDetails);
      }
    }

    return await this.riotRepository.getGamesFromRange(puuid, start, 10);
  }

  public async getDetailedGameInfo(
    language: string,
    region: string,
    gameId: string,
  ): Promise<DetailedGameDto> {
    return (await this.httpRiotService.getGameDetails(language, region, gameId))
      .gameDetails;
  }
}
