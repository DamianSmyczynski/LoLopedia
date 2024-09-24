import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from '../../app.symbol';
import 'dotenv/config';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { BasicChampionDto, ChampionDto } from '../../champions/champion.dto';
import { RiotChampionRepositoryInterface } from '../../infrastructure/riot/interfaces/riot-champion-repository.interface';
import { ChampionNotFoundError } from '../../errors/champion-not-found.error';
import { PatchVersionService } from '../patch-version/patch-version.service';

@Injectable()
export class ChampionsService {
  constructor(
    @Inject(AppSymbol.RiotChampionRepository)
    private readonly riotRepository: RiotChampionRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
    private readonly patchVersionService: PatchVersionService,
  ) {}

  public async updateChampionsData(language: string) {
    const newestPatch = await this.patchVersionService.getNewest();
    const champions = await this.httpRiotService.getAllChampions(
      language,
      newestPatch,
    );
    await this.riotRepository.updateAllChampions(language, champions);
  }

  public async getAllChampions(language: string): Promise<BasicChampionDto[]> {
    return this.riotRepository.getAllChampions(language);
  }

  public async getChampionDetailsByName(
    language: string,
    championName: string,
  ): Promise<ChampionDto> {
    const champion = await this.riotRepository.getChampionDetailsByName(
      language,
      championName,
    );

    const newestPatch = await this.patchVersionService.getNewest();

    if (champion.version !== newestPatch || champion.lore === '1') {
      const championDetails =
        await this.httpRiotService.getChampionDetailsByName(
          language,
          championName,
          newestPatch,
        );

      try {
        await this.riotRepository.saveChampion(language, championDetails);
        return championDetails;
      } catch (error) {
        throw new ChampionNotFoundError(championName);
      }
    }
    return champion;
  }
}
