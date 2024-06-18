import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ChampionDto } from 'src/champions/champion.dto';
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { LanguageToLanguageCodeMapper } from 'src/mappers/language-to-language-code.mapper';
import { ItemDto } from 'src/items/item.dto';
import { HttpRiotChampionResponseToChampionDtoMapper } from './mappers/http-riot-champion-response-to-champion-dto.mapper';
import { HttpRiotItemResponseToItemDtoMapper } from './mappers/http-riot-item-response-to-item-entity.mapper';

@Injectable()
export class HttpRiotService {
  private url;

  constructor(private readonly httpService: HttpService) {
    this.url = process.env.RIOT_API_URL;
  }

  public async getNewestPatch(): Promise<string> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.url}/api/versions.json`),
    );

    const newestPatch = JSON.stringify(response.data[0]);
    return newestPatch.substring(1, newestPatch.length - 1);
  }

  public async getAllChampions(language: string): Promise<ChampionDto[]> {
    const newestPatch = await this.getNewestPatch();

    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${newestPatch}/data/${languageCode}/champion.json`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_TOKEN,
          },
        },
      ),
    );

    return response.data.data;
  }

  public async getChampionDetails(
    language: string,
    championName: string,
  ): Promise<ChampionDto> {
    const newestPatch = await this.getNewestPatch();

    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${newestPatch}/data/${languageCode}/champion/${championName}.json`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_TOKEN,
          },
        },
      ),
    );

    const responseData = response.data;

    const champion = responseData.data[Object.keys(responseData.data)[0]];

    return HttpRiotChampionResponseToChampionDtoMapper.map(
      language,
      champion,
      responseData.version,
    );
  }

  public async getAllItems(language: string): Promise<ItemDto[]> {
    const newestPatch = await this.getNewestPatch();

    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${newestPatch}/data/${languageCode}/item.json`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_TOKEN,
          },
        },
      ),
    );

    const version = response.data.version;

    const items: ItemDto[] = [];

    for (const [key, value] of Object.entries(response.data.data)) {
      items.push(
        HttpRiotItemResponseToItemDtoMapper.map(language, version, key, value),
      );
    }
    return items;
  }
}
