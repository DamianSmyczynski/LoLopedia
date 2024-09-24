import { Controller, Get, Param } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { MasteryService } from '../services/mastery/mastery.service';

@Controller(':language/mastery')
export class MasteryController {
  constructor(private readonly masteryService: MasteryService) {}

  @Get(':region/:puuid')
  @ErrorMapper()
  async getTopMasteries(
    @Param('language') language: string,
    @Param('puuid') puuid: string,
    @Param('region') region: string,
  ): Promise<any[]> {
    return this.masteryService.getTopMasteries(language, puuid, region);
  }
}
