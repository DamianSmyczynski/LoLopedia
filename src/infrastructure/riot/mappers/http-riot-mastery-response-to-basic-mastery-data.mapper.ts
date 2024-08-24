import { BasicMasteryDto } from 'src/masteries/dto/basic-mastery-data.dto';
import { MasteryDto } from 'src/masteries/dto/mastery-champion-data.dto';
import { RiotChampionRepositoryInterface } from '../interfaces/riot-champion-repository.interface';

export class HttpRiotMasteryResponseToBasicMasteryDataMapper {
  public static async map(
    language: string,
    masteryData: MasteryDto,
    championService: RiotChampionRepositoryInterface,
  ): Promise<BasicMasteryDto> {
    const { name, id } = await this.getChampionDetailsById(
      language,
      masteryData.championId,
      championService,
    );

    return {
      championKey: masteryData.championId,
      championId: id,
      championLevel: masteryData.championLevel,
      championName: name,
      championPoints: masteryData.championPoints,
    };
  }

  private static async getChampionDetailsById(
    language: string,
    championId: number,
    championService: RiotChampionRepositoryInterface,
  ): Promise<{ name: string; id: string }> {
    const championDetails = await championService.getChampionDetailsById(
      language,
      championId.toString(),
    );

    return { name: championDetails.name, id: championDetails.id };
  }
}
