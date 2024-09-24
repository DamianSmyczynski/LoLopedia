import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from '../../app.symbol';
import { RiotAugmentRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-augment-repository.interface';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { PatchVersionService } from '../patch-version/patch-version.service';
import { AugmentDto } from '../../augments/augment.dto';

@Injectable()
export class AugmentService {
  constructor(
    @Inject(AppSymbol.RiotAugmentRepository)
    private readonly riotRepository: RiotAugmentRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
    private readonly patchVersionService: PatchVersionService,
  ) {}

  public async updateAll(language: string) {
    const newestPatch = await this.patchVersionService.getNewest();
    const augments = await this.httpRiotService.getAllAugments(
      language,
      newestPatch,
    );
    await this.riotRepository.updateAll(language, augments);
  }

  public async getAll(language: string): Promise<AugmentDto[]> {
    return this.riotRepository.getAll(language);
  }

  public async getDetailsById(
    language: string,
    augmentId: string,
  ): Promise<AugmentDto> {
    const augment = await this.riotRepository.getDetailsById(
      language,
      augmentId,
    );

    return augment;
  }
}
