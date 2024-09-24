import { Inject, Injectable } from '@nestjs/common';
import { BasicMasteryDto } from '../../../../masteries/dto/basic-mastery-data.dto';
import { MasteryDto } from '../../../../masteries/dto/mastery-champion-data.dto';
import { RiotChampionRepositoryInterface } from '../../interfaces/riot-champion-repository.interface';
import { AppSymbol } from 'src/app.symbol';

@Injectable()
export class HttpRiotMasteryResponseToBasicMasteryDataMapper {
  constructor(
    @Inject(AppSymbol.RiotChampionRepository)
    private readonly championService: RiotChampionRepositoryInterface,
  ) {}
  public async map(
    language: string,
    masteryData: MasteryDto,
  ): Promise<BasicMasteryDto> {
    const { name, id } = await this.getChampionDetailsById(
      language,
      masteryData.championId,
    );

    return {
      championKey: masteryData.championId,
      championId: id,
      championLevel: masteryData.championLevel,
      championName: name,
      championPoints: masteryData.championPoints,
    };
  }

  private async getChampionDetailsById(
    language: string,
    championId: number,
  ): Promise<{ name: string; id: string }> {
    const championDetails = await this.championService.getChampionDetailsById(
      language,
      championId.toString(),
    );

    return { name: championDetails.name, id: championDetails.id };
  }
}
