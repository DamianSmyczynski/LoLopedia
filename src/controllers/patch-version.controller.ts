import { Controller, Get } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { PatchVersionService } from '../services/patch-version/patch-version.service';

@Controller('patch-version')
export class PatchVersionController {
  constructor(private readonly patchVersionService: PatchVersionService) {}

  @Get('')
  @ErrorMapper()
  async getNewestPatchVersion(): Promise<string> {
    return this.patchVersionService.getNewest();
  }
}
