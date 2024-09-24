import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  BasicChampionDto,
  ChampionDto,
  ChampionSpell,
} from '../champions/champion.dto';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { ChampionsService } from '../services/champion/champion.service';

@Controller(':language/champions')
export class ChampionController {
  constructor(private readonly championsService: ChampionsService) {}

  @Post('update-champions-data')
  async updateChampionsData(@Param('language') language: string) {
    return this.championsService.updateChampionsData(language);
  }

  @Get('')
  async getAllChampions(
    @Param('language') language: string,
  ): Promise<BasicChampionDto[]> {
    return this.championsService.getAllChampions(language);
  }

  @Get(':champion')
  @ErrorMapper()
  async getChampionDetailsByName(
    @Param('language') language: string,
    @Param('champion') championName: string,
  ): Promise<ChampionDto> {
    return this.championsService.getChampionDetailsByName(
      language,
      championName,
    );
  }

  @Get(':champion/spells')
  @ErrorMapper()
  async getChampionSpellsByName(
    @Param('language') language: string,
    @Param('champion') championName: string,
  ): Promise<ChampionSpell[]> {
    const championDetails =
      await this.championsService.getChampionDetailsByName(
        language,
        championName,
      );
    return championDetails.spells;
  }
}
