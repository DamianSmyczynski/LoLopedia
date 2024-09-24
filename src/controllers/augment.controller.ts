import { Controller, Post, Param, Get } from '@nestjs/common';
import { ErrorMapper } from '../decorators/error-mapper.decorator';
import { AugmentDto } from '../Augments/Augment.dto';
import { AugmentService } from '../services/Augment/Augment.service';

@Controller(':language/augments')
export class AugmentController {
  constructor(private readonly augmentsService: AugmentService) {}

  @Post('update-all')
  async updateAll(@Param('language') language: string) {
    await this.augmentsService.updateAll(language);
  }

  @Get('')
  async getAllAugments(
    @Param('language') language: string,
  ): Promise<AugmentDto[]> {
    return await this.augmentsService.getAll(language);
  }

  @Get(':augmentId')
  @ErrorMapper()
  async getDetails(
    @Param('language') language: string,
    @Param('augmentId') augmentId: string,
  ): Promise<AugmentDto> {
    return await this.augmentsService.getDetailsById(language, augmentId);
  }
}
