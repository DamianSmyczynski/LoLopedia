import { Controller, Get, Param, Query } from '@nestjs/common';
import { ErrorMapper } from 'src/decorators/error-mapper.decorator';
import { BasicGameDto } from 'src/games/dto/basic-game.dto';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';

@Controller('api/game')
export class GameController {
  constructor(private readonly httpRiotService: HttpRiotService) {}

  @Get(':region/:puuid')
  @ErrorMapper()
  async getBasicGamesList(
    @Query('gamesCount') gamesCount: number,
    @Param('puuid') puuid: string,
    @Param('region') region: string,
    @Query('start') start: number,
    @Query('gameType') gameType?: string,
  ): Promise<BasicGameDto[]> {
    return this.httpRiotService.getBasicGamesList(
      gamesCount,
      gameType,
      puuid,
      region,
      start,
    );
  }
}
