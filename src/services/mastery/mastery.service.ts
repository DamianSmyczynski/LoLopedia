import 'dotenv/config';
import { Inject, Injectable } from '@nestjs/common';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { HttpRiotMasteryResponseToBasicMasteryDataMapper } from '../../infrastructure/riot/mappers/mastery';

@Injectable()
export class MasteryService {
  constructor(
    @Inject()
    private readonly httpRiotService: HttpRiotService,
    private readonly httpRiotMasteryResponseToBasicMasteryDataMapper: HttpRiotMasteryResponseToBasicMasteryDataMapper,
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
        this.httpRiotMasteryResponseToBasicMasteryDataMapper.map(
          language,
          mastery,
        ),
      ),
    );

    return mappedTopMasteries;
  }
}
