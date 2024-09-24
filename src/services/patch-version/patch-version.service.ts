import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from '../../app.symbol';
import { PatchVersionRepositoryInterface } from '../../infrastructure/riot/interfaces/patch-version-respository.interface';

@Injectable()
export class PatchVersionService {
  constructor(
    @Inject(AppSymbol.PatchVersionRepository)
    private readonly patchVersionRepository: PatchVersionRepositoryInterface,
  ) {}

  public async getNewest(): Promise<string> {
    return this.patchVersionRepository.getNewest();
  }
}
