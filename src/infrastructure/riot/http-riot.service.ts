import { HttpService } from '@nestjs/axios';
import { lastValueFrom, min } from 'rxjs';
import { ChampionDto } from 'src/champions/champion.dto';
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { LanguageToLanguageCodeMapper } from 'src/mappers/language-to-language-code.mapper';
import { ItemDto } from 'src/items/item.dto';
import { HttpRiotChampionResponseToChampionDtoMapper } from './mappers/http-riot-champion-response-to-champion-dto.mapper';
import { HttpRiotItemResponseToItemDtoMapper } from './mappers/http-riot-item-response-to-item-entity.mapper';
import { HttpRiotAccountResponseToAccountDtoMapper } from './mappers/http-riot-account-response-to-account-dto.mapper';
import { AccountNotFoundError } from 'src/errors/account-not-found.error';
import { GameDto } from 'src/games/dto/game.dto';
import { GameToBasicGameDetailsMapper } from './mappers/game-to-basic-game-details.mapper';
import { BasicGameDto } from 'src/games/dto/basic-game.dto';
import { ServerNameToServerCodeMapper } from 'src/mappers/server-name-to-server-code.mapper';
import { ServerNameToRegionNameMapper } from 'src/mappers/server-name-to-region-name.mapper';
import { RankDto } from 'src/accounts/dto/rank.dto';
import { AccountDto } from 'src/accounts/dto/account.dto';
import { queueTypes } from 'src/queue-type';
import { StartValueOutOfRange } from 'src/errors/starting-value-out-of-range.error';
import { GamesCountIsTooHighError } from 'src/errors/games-count-is-too-hight.error';
import { GameNotFoundError } from 'src/errors/game-not-found.error';
import { MasteryDto } from 'src/masteries/dto/mastery-champion-data.dto';
import { HttpRiotMasteryResponseToBasicMasteryDataMapper } from './mappers/http-riot-mastery-response-to-basic-mastery-data.mapper';

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

  public async getChampionDetailsByName(
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

  public async getAccount(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<AccountDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_TOKEN,
            },
          },
        ),
      );

      const { summonerId, summonerLevel, profileIconId } =
        await this.getAccountDetails(region, response.data.puuid);

      const { soloQueueRank, flexQueueRank } = await this.getAccountRank(
        region,
        summonerId,
      );

      return HttpRiotAccountResponseToAccountDtoMapper.map(
        response.data,
        summonerLevel,
        profileIconId,
        soloQueueRank,
        flexQueueRank,
        region,
      );
    } catch (error) {
      throw new AccountNotFoundError(gameName);
    }
  }

  public async getBasicGamesList(
    gamesCount: number,
    gameType: string,
    puuid: string,
    region: string,
    start: number,
  ): Promise<BasicGameDto[]> {
    const allSummonerSpells = await this.getAllSummonerSpells();
    const gamesIdsList = await this.getGameIdsList(
      gamesCount,
      gameType,
      puuid,
      region,
      start,
    );
    const basicGamesList = gamesIdsList.map((id) =>
      this.getGameDetails(region, id),
    );

    const detailedGamesResult: GameDto[] = await Promise.all(basicGamesList);

    return detailedGamesResult.map((game) =>
      GameToBasicGameDetailsMapper.map(region, game, puuid, allSummonerSpells),
    );
  }

  public async getGameDetails(region: string, gameId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/${gameId}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_TOKEN,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new GameNotFoundError(gameId);
    }
  }

  public async getTopMasteries(puuid: string, region: string) {
    const topCount = 5;

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToServerCodeMapper.map(region)}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${topCount}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_TOKEN,
            },
          },
        ),
      );

      const topMasteries: MasteryDto[] = response.data;

      return topMasteries;
      // return topMasteries.map((mastery) =>
      //   HttpRiotMasteryResponseToBasicMasteryDataMapper.map(mastery),
      // );
    } catch (error) {
      throw new AccountNotFoundError(puuid);
    }
  }

  private async getAccountDetails(
    region: string,
    puuid: string,
  ): Promise<{
    summonerId: string;
    summonerLevel: number;
    profileIconId: number;
  }> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToServerCodeMapper.map(region)}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_TOKEN,
            },
          },
        ),
      );
      return {
        summonerId: response.data.id,
        summonerLevel: response.data.summonerLevel,
        profileIconId: response.data.profileIconId,
      };
    } catch (error) {
      throw new AccountNotFoundError(puuid);
    }
  }

  private async getAccountRank(
    region: string,
    summonerId: string,
  ): Promise<{ soloQueueRank: RankDto; flexQueueRank: RankDto }> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToServerCodeMapper.map(region)}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_TOKEN,
            },
          },
        ),
      );

      const soloQueueRank = response.data.find(
        (rank) => rank.queueType === 'RANKED_SOLO_5x5',
      );
      const flexQueueRank = response.data.find(
        (rank) => rank.queueType === 'RANKED_FLEX_SR',
      );

      return { soloQueueRank: soloQueueRank, flexQueueRank: flexQueueRank };
    } catch (error) {
      throw new AccountNotFoundError(summonerId);
    }
  }

  private async getGameIdsList(
    gamesCount: number,
    gameType: string,
    puuid: string,
    region: string,
    start: number,
  ): Promise<string[]> {
    const minValue = 0;
    const maxValue = 20;
    const maxGamesCount = 10;

    if (start < minValue || start > maxValue) {
      throw new StartValueOutOfRange(minValue, maxValue);
    }

    if (gamesCount > maxGamesCount) {
      throw new GamesCountIsTooHighError(gamesCount, maxGamesCount);
    }

    let gameListUrl = `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${gamesCount}`;

    if (gameType) {
      const gameTypeId = queueTypes.find((type) => type.name === gameType).id;
      gameListUrl += `&queue=${gameTypeId}`;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(gameListUrl, {
          headers: {
            'X-Riot-Token': process.env.RIOT_TOKEN,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new AccountNotFoundError(puuid);
    }
  }

  private async getAllSummonerSpells(): Promise<{ id: string; key: string }[]> {
    const newestPatch = await this.getNewestPatch();
    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${newestPatch}/data/en_US/summoner.json`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_TOKEN,
          },
        },
      ),
    );

    const summonerSpellsIds: { id: string; key: string }[] = [];
    for (const [key, value] of Object.entries(response.data.data)) {
      const { id, key } = value as { id?: string; key?: string };
      summonerSpellsIds.push({ id, key });
    }
    return summonerSpellsIds;
  }
}
