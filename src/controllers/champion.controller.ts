import { Controller, Get, Param, Post } from '@nestjs/common';
import { BasicChampionDto, ChampionDto } from 'src/champions/champion.dto';
import { ErrorMapper } from 'src/decorators/error-mapper.decorator';
import { ChampionsService } from 'src/services/champion/champion.service';

@Controller('api/:language/champions')
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
}
