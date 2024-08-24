import { Controller, Get } from '@nestjs/common';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';

@Controller('api/patch-version')
export class PatchVersionController {
  constructor(private readonly httpRiotService: HttpRiotService) {}

  @Get('')
  async getNewestPatchVersion(): Promise<string> {
    return this.httpRiotService.getNewestPatch();
  }
}
