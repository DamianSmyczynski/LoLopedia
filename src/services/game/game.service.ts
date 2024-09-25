import { Inject, Injectable } from '@nestjs/common';
import { BasicGameDto } from '../../games/dto/basic-game/basic-game.dto';
import { DetailedGameDto } from '../../games/dto/detailed-game/detailed-game.dto';
import { HttpRiotService } from '../../infrastructure/riot/http-riot.service';
import { AppSymbol } from 'src/app.symbol';
import { RiotGameRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-game-repository.interface';
import {
  MainParticipantDto,
  MainParticipantRunesDto,
} from 'src/games/dto/basic-game/main-participant.dto';
import { RiotAugmentRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-augment-repository.interface';
import { RiotItemRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-item-repository.interface';
import { RiotRuneRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-Rune-repository.interface';
import { RiotSummonerSpellRepositoryInterface } from 'src/infrastructure/riot/interfaces/riot-summoner-spell-repository.interface';
import { BasicItemDto } from 'src/items/item.dto';
import { AugmentDto } from 'src/augments/augment.dto';

@Injectable()
export class GameService {
  constructor(
    @Inject(AppSymbol.RiotAugmentRepository)
    private readonly augmentService: RiotAugmentRepositoryInterface,
    @Inject(AppSymbol.RiotItemRepository)
    private readonly itemService: RiotItemRepositoryInterface,
    @Inject(AppSymbol.RiotRuneRepository)
    private readonly runeService: RiotRuneRepositoryInterface,
    @Inject(AppSymbol.RiotSummonerSpellRepository)
    private readonly summonerSpellService: RiotSummonerSpellRepositoryInterface,
    @Inject(AppSymbol.RiotGameRepository)
    private readonly riotRepository: RiotGameRepositoryInterface,
    private readonly httpRiotService: HttpRiotService,
  ) {}

  public async getBasicGamesList(
    language: string,
    gameType: string,
    puuid: string,
    region: string,
    start: number,
  ): Promise<BasicGameDto[]> {
    const latestGamesIdsList = await this.httpRiotService.getGameIdsList(
      puuid,
      region,
      50,
      gameType,
      0,
    );

    await this.riotRepository.updateGameIds(latestGamesIdsList, puuid);

    const latestGamesList: BasicGameDto[] =
      await this.riotRepository.getGamesFromRange(puuid, start, 10);

    for (const game of latestGamesList) {
      if (game.gameDate && game.language !== language) {
        const translatedGame = await this.translateGame(language, game);
        await this.riotRepository.save(translatedGame);
      }
      if (!game.gameDate) {
        const { basicGameDetails } = await this.httpRiotService.getGameDetails(
          language,
          region,
          game.matchId,
          puuid,
        );
        await this.riotRepository.save(basicGameDetails);
      }
    }

    return await this.riotRepository.getGamesFromRange(puuid, start, 10);
  }

  public async getDetailedGameInfo(
    language: string,
    region: string,
    gameId: string,
  ): Promise<DetailedGameDto> {
    return (await this.httpRiotService.getGameDetails(language, region, gameId))
      .gameDetails;
  }

  private async translateGame(
    language: string,
    game: BasicGameDto,
  ): Promise<BasicGameDto> {
    const mainParticipant: MainParticipantDto = game.mainBasicParticipant;
    const mainParticipantItems: BasicItemDto[] = game.mainParticipantItems;

    const translatedAugments: AugmentDto[] = [];
    console.log(mainParticipant);
    for (const augment of mainParticipant.playerAugments) {
      if (augment) {
        const translatedAugment = await this.augmentService.getDetailsById(
          language,
          augment.id,
        );
        translatedAugments.push(translatedAugment);
      }
    }

    const translatedItems: BasicItemDto[] = [];
    for (const item of mainParticipantItems) {
      if (item) {
        const translatedItem = await this.itemService.getItemDetails(
          language,
          item.id,
        );
        translatedItems.push(translatedItem);
      }
    }

    const translatedRunes: MainParticipantRunesDto = {
      primaryRune: null,
      subRune: null,
    };
    if (mainParticipant.runes.primaryRune) {
      translatedRunes.primaryRune = await this.runeService.getDetailsById(
        language,
        mainParticipant.runes.primaryRune.id.toString(),
      );
      translatedRunes.subRune = await this.runeService.getDetailsById(
        language,
        mainParticipant.runes.subRune.id.toString(),
      );
    }

    const [translatedSummonerSpell1, translatedSummonerSpell2] =
      await Promise.all([
        this.summonerSpellService.getDetailsById(
          language,
          mainParticipant.summonerSpell1.id.toString(),
        ),
        this.summonerSpellService.getDetailsById(
          language,
          mainParticipant.summonerSpell2.id.toString(),
        ),
      ]);

    const translatedParticipant: MainParticipantDto = {
      ...mainParticipant,
      playerAugments: translatedAugments,
      runes: translatedRunes,
      summonerSpell1: translatedSummonerSpell1,
      summonerSpell2: translatedSummonerSpell2,
    };
    return {
      ...game,
      language: language,
      mainBasicParticipant: translatedParticipant,
      mainParticipantItems: translatedItems,
    };
  }
}
