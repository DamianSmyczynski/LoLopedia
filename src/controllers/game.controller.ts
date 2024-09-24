import { Controller, Get, Param, Query } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { GamesCountIsTooHighError } from '../errors/games-count-is-too-hight.error';
import { StartValueOutOfRangeError } from '../errors/starting-value-out-of-range.error';
import { BasicGameDto } from '../games/dto/basic-game/basic-game.dto';
import { DetailedGameDto } from '../games/dto/detailed-game/detailed-game.dto';
import { GameService } from '../services/game/game.service';

@Controller(':language/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':region/:puuid')
  @ErrorMapper()
  async getBasicGamesList(
    @Param('language') language: string,
    @Param('puuid') puuid: string,
    @Param('region') region: string,
    @Query('start') start: number,
    @Query('gameType') gameType?: string,
  ): Promise<BasicGameDto[]> {
    const minValue = 0;
    const maxValue = 100;

    if (start < minValue || start > maxValue) {
      throw new StartValueOutOfRangeError(minValue, maxValue);
    }

    return this.gameService.getBasicGamesList(
      language,
      gameType,
      puuid,
      region,
      start,
    );
  }

  @Get(':region')
  @ErrorMapper()
  async getDetailedGameInfo(
    @Param('language') language: string,
    @Param('region') region: string,
    @Query('gameId') gameId: string,
  ): Promise<DetailedGameDto> {
    return this.gameService.getDetailedGameInfo(language, region, gameId);
  }
}
