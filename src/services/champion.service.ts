import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from 'src/app.symbol';
import 'dotenv/config';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';
import { BasicChampionDto, ChampionDto } from 'src/champions/champion.dto';
import { RiotChampionRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-champion-repository.interface';
@Injectable()
export class ChampionsService {
  constructor(
    @Inject(AppSymbol.RiotChampionRepository)
    private readonly riotRepository: RiotChampionRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async updateChampionsData(language: string) {
    const champions = await this.httpRiotService.getAllChampions(language);
    await this.riotRepository.updateAllChampions(language, champions);
  }

  public async getAllChampions(language: string): Promise<BasicChampionDto[]> {
    return this.riotRepository.getAllChampions(language);
  }

  public async getChampionDetails(
    language: string,
    championName: string,
  ): Promise<ChampionDto> {
    const champion = await this.riotRepository.getChampionDetails(
      language,
      championName,
    );

    const newestPatch = await this.httpRiotService.getNewestPatch();

    if (champion.version !== newestPatch || champion.lore === '1') {
      const championDetails = await this.httpRiotService.getChampionDetails(
        language,
        championName,
      );

      try {
        await this.riotRepository.saveChampion(language, championDetails);
      } catch (error) {
        console.error(error);
      } finally {
        return championDetails;
      }
    }
    return champion;
  }
}
