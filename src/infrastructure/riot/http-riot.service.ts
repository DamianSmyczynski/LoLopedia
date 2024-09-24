import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ChampionDto } from '../../champions/champion.dto';
import 'dotenv/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { LanguageToLanguageCodeMapper } from '../../mappers/language-to-language-code.mapper';
import { ItemDto } from '../../items/item.dto';
import { AccountNotFoundError } from '../../errors/account-not-found.error';
import { RankDto } from '../../accounts/dto/rank.dto';
import { AccountDto } from '../../accounts/dto/account.dto';
import { queueTypes } from '../../queue-type';
import { GameNotFoundError } from '../../errors/game-not-found.error';
import { MasteryDto } from '../../masteries/dto/mastery-champion-data.dto';
import { AugmentDto } from '../../augments/augment.dto';
import { RuneDto } from '../../runes/rune.dto';
import { SummonerSpellDto } from '../../summoner-spells/summoner-spell.dto';
import { ServerNameToRegionNameMapper } from '../../mappers/server-name-to-region-name.mapper';
import { ServerNameToServerCodeMapper } from '../../mappers/server-name-to-server-code.mapper';
import { HttpRiotAccountResponseToAccountDtoMapper } from './mappers/account';
import { HttpRiotAugmentResponseToAugmentDtoMapper } from './mappers/augment';
import { HttpRiotChampionResponseToChampionDtoMapper } from './mappers/champion';
import { HttpRiotItemResponseToItemDtoMapper } from './mappers/item';
import { HttpRiotRuneResponseToRuneDtoMapper } from './mappers/rune';
import { HttpRiotSummonerSpellResponseToSummonerSpellDtoMapper } from './mappers/summoner-spell';
import {
  GameToBasicGameDetailsMapper,
  GameToDetailedGameMapper,
  GameToGameTimelineMapper,
} from './mappers/game';
import { BasicGameDto } from '../../games/dto/basic-game/basic-game.dto';
import { DetailedGameDto } from '../../games/dto/detailed-game/detailed-game.dto';
import { GameTimelineDto } from '../../games/dto/timeline/game-timeline.dto';

const getOptions = () => {
  return {
    headers: {
      'X-Riot-Token': process.env.RIOT_TOKEN,
    },
  };
};
@Injectable()
export class HttpRiotService {
  private url;

  constructor(
    private readonly httpService: HttpService,
    private readonly gameToBasicGameDetailsMapper: GameToBasicGameDetailsMapper,
    private readonly gameToDetailedGameMapper: GameToDetailedGameMapper,
  ) {
    this.url = process.env.RIOT_API_URL;
  }

  public async getAllAugments(
    language: string,
    patchVersion: string,
  ): Promise<AugmentDto[]> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const parts = patchVersion.split('.');

    const simplifiedPatchVersion = `${parts[0]}.${parts[1]}`;

    const response = await lastValueFrom(
      this.httpService.get(
        `https://raw.communitydragon.org/${simplifiedPatchVersion}/cdragon/arena/${languageCode.toLowerCase()}.json`,
      ),
    );

    const augments: AugmentDto[] = [];

    for (const [key, value] of Object.entries(response.data.augments)) {
      augments.push(
        HttpRiotAugmentResponseToAugmentDtoMapper.map(language, value),
      );
    }
    return augments;
  }

  public async getAllChampions(
    language: string,
    patchVersion: string,
  ): Promise<ChampionDto[]> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${patchVersion}/data/${languageCode}/champion.json`,
      ),
    );

    return response.data.data;
  }

  public async getAllSummonerSpells(
    language: string,
    patchVersion: string,
  ): Promise<SummonerSpellDto[]> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${patchVersion}/data/${languageCode}/summoner.json`,
      ),
    );

    const summonerSpells: SummonerSpellDto[] = [];
    for (const [key, value] of Object.entries(response.data.data)) {
      summonerSpells.push(
        HttpRiotSummonerSpellResponseToSummonerSpellDtoMapper.map(
          language,
          value,
        ),
      );
    }
    return summonerSpells;
  }

  public async getAllItems(
    language: string,
    patchVersion: string,
  ): Promise<ItemDto[]> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${patchVersion}/data/${languageCode}/item.json`,
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

  public async getAllRunes(
    language: string,
    patchVersion: string,
  ): Promise<RuneDto[]> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${patchVersion}/data/${languageCode}/runesReforged.json`,
      ),
    );

    const majorRunes: RuneDto[] = [];
    for (const [key, value] of Object.entries(response.data)) {
      majorRunes.push(HttpRiotRuneResponseToRuneDtoMapper.map(language, value));
    }

    const runes: RuneDto[] = [];
    for (const [key, value] of Object.entries(response.data)) {
      const slots = (value as any).slots;
      const allRunes = [];
      slots.forEach((slot) => {
        allRunes.push(...slot.runes);
      });
      allRunes.forEach((rune) => {
        runes.push(HttpRiotRuneResponseToRuneDtoMapper.map(language, rune));
      });
    }

    return [...majorRunes, ...runes];
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
          getOptions(),
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
      if (error.response.status === HttpStatus.NOT_FOUND) {
        throw new AccountNotFoundError(gameName);
      }
      throw error;
    }
  }

  public async getChampionDetailsByName(
    language: string,
    championName: string,
    patchVersion: string,
  ): Promise<ChampionDto> {
    const languageCode = LanguageToLanguageCodeMapper.map(language);

    const response = await lastValueFrom(
      this.httpService.get(
        `${this.url}/cdn/${patchVersion}/data/${languageCode}/champion/${championName}.json`,
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

  public async getGameDetails(
    language: string,
    region: string,
    gameId: string,
    puuid?: string,
  ): Promise<{
    basicGameDetails: BasicGameDto;
    gameDetails: DetailedGameDto;
    gameTimeline: GameTimelineDto;
  }> {
    if (puuid) {
      try {
        const response = await lastValueFrom(
          this.httpService.get(
            `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/${gameId}`,
            getOptions(),
          ),
        );

        const basicGameDetails = await this.gameToBasicGameDetailsMapper.map(
          region,
          language,
          response.data,
          puuid,
        );

        return {
          basicGameDetails: basicGameDetails,
          gameDetails: null,
          gameTimeline: null,
        };
      } catch (error) {
        if (error.response?.status === HttpStatus.NOT_FOUND) {
          throw new GameNotFoundError(gameId);
        }
        throw error;
      }
    }
    try {
      const [gameDetailsResponse, gameTimelineReponse] = await Promise.all([
        lastValueFrom(
          this.httpService.get(
            `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/${gameId}`,
            getOptions(),
          ),
        ),
        lastValueFrom(
          this.httpService.get(
            `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/${gameId}/timeline`,
            getOptions(),
          ),
        ),
      ]);

      const gameTimeline = gameTimelineReponse.data;
      const gameDetails = await this.gameToDetailedGameMapper.map(
        language,
        gameDetailsResponse.data,
        gameTimeline,
      );
      return {
        basicGameDetails: null,
        gameDetails: gameDetails,
        gameTimeline: gameTimeline,
      };
    } catch (error) {
      if (error.response?.status === HttpStatus.NOT_FOUND) {
        throw new GameNotFoundError(gameId);
      }
      throw error;
    }
  }

  public async getGameIdsList(
    puuid: string,
    region: string,
    gamesCount?: number,
    gameType?: string,
    start?: number,
  ): Promise<string[]> {
    let gameListUrl = `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?`;

    if (start) {
      gameListUrl += `&start=${start}`;
    }

    if (gamesCount) {
      gameListUrl += `&count=${gamesCount}`;
    }

    if (gameType) {
      const gameTypeId = queueTypes.find((type) => type.name === gameType).id;
      gameListUrl += `&queue=${gameTypeId}`;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(gameListUrl, getOptions()),
      );

      return response.data;
    } catch (error) {
      throw new AccountNotFoundError(puuid);
    }
  }

  public async getNewestGameIdsList(
    puuid: string,
    region: string,
    startTime: number,
    gameType?: string,
  ): Promise<string[]> {
    let gameListUrl = `https://${ServerNameToRegionNameMapper.map(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=10&startTime=${startTime}`;

    if (gameType) {
      const gameTypeId = queueTypes.find((type) => type.name === gameType).id;
      gameListUrl += `&queue=${gameTypeId}`;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(gameListUrl, getOptions()),
      );

      return response.data;
    } catch (error) {
      throw new AccountNotFoundError(puuid);
    }
  }

  public async getTopMasteries(puuid: string, region: string) {
    const topCount = 5;

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://${ServerNameToServerCodeMapper.map(region)}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${topCount}`,
          getOptions(),
        ),
      );

      const topMasteries: MasteryDto[] = response.data;

      return topMasteries;
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
          getOptions(),
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
          getOptions(),
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
}
