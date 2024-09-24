import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from '../../app.symbol';
import { RiotRuneRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-Rune-repository.interface';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { PatchVersionService } from '../patch-version/patch-version.service';
import { RuneDto } from '../../Runes/Rune.dto';

@Injectable()
export class RuneService {
  constructor(
    @Inject(AppSymbol.RiotRuneRepository)
    private readonly riotRepository: RiotRuneRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
    private readonly patchVersionService: PatchVersionService,
  ) {}

  public async updateAll(language: string) {
    const newestPatch = await this.patchVersionService.getNewest();
    const runes = await this.httpRiotService.getAllRunes(language, newestPatch);

    await this.riotRepository.updateAll(language, runes);
  }

  public async getAll(language: string): Promise<RuneDto[]> {
    return this.riotRepository.getAll(language);
  }

  public async getDetailsById(
    language: string,
    runeId: string,
  ): Promise<RuneDto> {
    const rune = await this.riotRepository.getDetailsById(language, runeId);

    return rune;
  }
}
