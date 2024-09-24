import { Controller, Post, Param, Get } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { SummonerSpellService } from '../services/summoner-spell/summoner-spell.service';
import { SummonerSpellDto } from '../summoner-spells/summoner-spell.dto';

@Controller(':language/summoner-spells')
export class SummonerSpellController {
  constructor(private readonly summonerSpellsService: SummonerSpellService) {}

  @Post('update-all')
  async updateAll(@Param('language') language: string) {
    await this.summonerSpellsService.updateAll(language);
  }

  @Get('')
  async getAllSummonerSpells(
    @Param('language') language: string,
  ): Promise<SummonerSpellDto[]> {
    return await this.summonerSpellsService.getAll(language);
  }

  @Get(':summonerSpellId')
  @ErrorMapper()
  async getDetails(
    @Param('language') language: string,
    @Param('summonerSpellId') summonerSpellId: string,
  ): Promise<SummonerSpellDto> {
    return await this.summonerSpellsService.getDetailsById(
      language,
      summonerSpellId,
    );
  }
}
