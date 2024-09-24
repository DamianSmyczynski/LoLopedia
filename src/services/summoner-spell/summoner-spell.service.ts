import { Injectable, Inject } from '@nestjs/common';
import { AppSymbol } from 'src/app.symbol';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';
import { SummonerSpellDto } from 'src/summoner-spells/summoner-spell.dto';
import { PatchVersionService } from '../patch-version/patch-version.service';
import { RiotSummonerSpellRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-summoner-spell-repository.interface';

@Injectable()
export class SummonerSpellService {
  constructor(
    @Inject(AppSymbol.RiotSummonerSpellRepository)
    private readonly riotRepository: RiotSummonerSpellRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
    private readonly patchVersionService: PatchVersionService,
  ) {}

  public async updateAll(language: string) {
    const newestPatch = await this.patchVersionService.getNewest();
    const summonerSpells = await this.httpRiotService.getAllSummonerSpells(
      language,
      newestPatch,
    );

    await this.riotRepository.updateAll(language, summonerSpells);
  }

  public async getAll(language: string): Promise<SummonerSpellDto[]> {
    return this.riotRepository.getAll(language);
  }

  public async getDetailsById(
    language: string,
    summonerSpellId: string,
  ): Promise<SummonerSpellDto> {
    const summonerSpell = await this.riotRepository.getDetailsById(
      language,
      summonerSpellId,
    );

    return summonerSpell;
  }
}
