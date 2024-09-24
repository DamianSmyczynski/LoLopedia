import { Controller, Post, Param, Get } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { RuneDto } from '../Runes/Rune.dto';
import { RuneService } from '../services/Rune/Rune.service';

@Controller(':language/runes')
export class RuneController {
  constructor(private readonly runesService: RuneService) {}

  @Post('update-all')
  async updateAll(@Param('language') language: string) {
    await this.runesService.updateAll(language);
  }

  @Get('')
  async getAllRunes(@Param('language') language: string): Promise<RuneDto[]> {
    return await this.runesService.getAll(language);
  }

  @Get(':runeId')
  @ErrorMapper()
  async getDetails(
    @Param('language') language: string,
    @Param('runeId') runeId: string,
  ): Promise<RuneDto> {
    return await this.runesService.getDetailsById(language, runeId);
  }
}
