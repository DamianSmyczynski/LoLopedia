import { Inject, Injectable } from '@nestjs/common';
import { AppSymbol } from 'src/app.symbol';
import 'dotenv/config';
import { HttpRiotService } from 'src/infrastructure/riot/http-riot.service';
import { BasicChampionDto, ChampionDto } from 'src/champions/champion.dto';
import { RiotChampionRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-champion-repository.interface';
import { BasicMasteryDto } from 'src/masteries/dto/basic-mastery-data.dto';
import { HttpRiotMasteryResponseToBasicMasteryDataMapper } from 'src/infrastructure/riot/mappers/http-riot-mastery-response-to-basic-mastery-data.mapper';

@Injectable()
export class MasteryService {
  constructor(
    @Inject(AppSymbol.RiotChampionRepository)
    private readonly riotRepository: RiotChampionRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async getTopMasteries(
    language: string,
    puuid: string,
    region: string,
  ) {
    const topMasteries = await this.httpRiotService.getTopMasteries(
      puuid,
      region,
    );

    const mappedTopMasteries = Promise.all(
      topMasteries.map((mastery) =>
        HttpRiotMasteryResponseToBasicMasteryDataMapper.map(
          language,
          mastery,
          this.riotRepository,
        ),
      ),
    );

    return mappedTopMasteries;
  }
}
