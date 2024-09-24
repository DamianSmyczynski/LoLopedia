import { Inject, Injectable } from '@nestjs/common';
import {
  BasicGameDto,
  TeamKDA,
} from '../../../../games/dto/basic-game/basic-game.dto';
import { BasicParticipantDto } from '../../../../games/dto/basic-game/basic-participant.dto';
import { MainParticipantDto } from '../../../../games/dto/basic-game/main-participant.dto';
import { queueTypes } from '../../../../queue-type';
import { GameDto } from '../../../../games/dto/riot-http-game/game.dto';
import { ParticipantDto } from '../../../../games/dto/riot-http-game/participant.dto';
import { RuneDto } from '../../../../runes/rune.dto';
import { AppSymbol } from '../../../../app.symbol';
import { RiotAugmentRepositoryInterface } from '../../interfaces/riot-augment-repository.interface';
import { RiotRuneRepositoryInterface } from '../../interfaces/riot-Rune-repository.interface';
import { RiotSummonerSpellRepositoryInterface } from '../../interfaces/riot-summoner-spell-repository.interface';
import { BasicItemDto } from 'src/items/item.dto';
import { RiotItemRepositoryInterface } from '../../interfaces/riot-item-repository.interface';
import { ItemDtoToBasicItemDtoMapper } from '../item/item-dto-to-basic-item-dto.mapper';

@Injectable()
export class GameToBasicGameDetailsMapper {
  constructor(
    @Inject(AppSymbol.RiotAugmentRepository)
    private readonly augmentService: RiotAugmentRepositoryInterface,
    @Inject(AppSymbol.RiotItemRepository)
    private readonly itemService: RiotItemRepositoryInterface,
    @Inject(AppSymbol.RiotRuneRepository)
    private readonly runeService: RiotRuneRepositoryInterface,
    @Inject(AppSymbol.RiotSummonerSpellRepository)
    private readonly summonerSpellService: RiotSummonerSpellRepositoryInterface,
  ) {}
  public async map(
    region: string,
    language: string,
    game: GameDto,
    puuid: string,
  ): Promise<BasicGameDto> {
    const { mainParticipantData, items, win } =
      await this.extractMainParticipantsData(
        game.info.participants,
        language,
        puuid,
      );

    const { blueTeamKDA, redTeamKDA } =
      GameToBasicGameDetailsMapper.extractTeamsKDA(game.info.participants);

    return {
      puuid: puuid,
      server: region,
      gameDate: new Date(game.info.gameStartTimestamp),
      gameMode: game.info.gameMode,
      gameType: GameToBasicGameDetailsMapper.extractGameTypeByQueueId(
        game.info.queueId,
      ),
      matchId: game.metadata.matchId,
      mainBasicParticipant: mainParticipantData,
      otherBasicParticipants:
        GameToBasicGameDetailsMapper.extractOtherParticipants(
          game.info.participants,
          puuid,
        ),
      mainParticipantItems: items,
      blueTeamKDA: blueTeamKDA,
      redTeamKDA: redTeamKDA,
      gameDurationTime: game.info.gameEndTimestamp
        ? game.info.gameDuration
        : game.info.gameDuration / 1000,
      win: win,
    };
  }

  private static extractGameTypeByQueueId(queueId: number): string {
    return queueTypes.find((type) => type.id === queueId).name;
  }

  private async extractMainParticipantsData(
    participants: ParticipantDto[],
    language: string,
    puuid: string,
  ): Promise<{
    mainParticipantData: MainParticipantDto;
    items: BasicItemDto[];
    win: boolean;
  }> {
    const mainParticipant = participants.find(
      (participant) => participant.puuid === puuid,
    );

    const augments = await Promise.all([
      this.augmentService.getDetailsById(
        language,
        mainParticipant.playerAugment1.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        mainParticipant.playerAugment2.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        mainParticipant.playerAugment3.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        mainParticipant.playerAugment4.toString(),
      ),
    ]);

    const items: BasicItemDto[] = (
      await Promise.all([
        this.itemService.getItemDetails(
          language,
          mainParticipant.item0.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item1.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item2.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item3.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item4.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item5.toString(),
        ),
        this.itemService.getItemDetails(
          language,
          mainParticipant.item6.toString(),
        ),
      ])
    ).map((item) => {
      if (item) {
        return ItemDtoToBasicItemDtoMapper.map(item);
      }
    });

    const primaryRune: RuneDto = await this.runeService.getDetailsById(
      language,
      mainParticipant.perks.styles[0].style.toString(),
    );

    const subRune: RuneDto = await this.runeService.getDetailsById(
      language,
      mainParticipant.perks.styles[1].style.toString(),
    );

    const [summonerSpell1, summonerSpell2] = await Promise.all([
      this.summonerSpellService.getDetailsById(
        language,
        mainParticipant.summoner1Id.toString(),
      ),
      this.summonerSpellService.getDetailsById(
        language,
        mainParticipant.summoner2Id.toString(),
      ),
    ]);

    return {
      mainParticipantData: {
        assists: mainParticipant.assists,
        championId: mainParticipant.championId,
        championName: mainParticipant.championName,
        champLevel: mainParticipant.champLevel,
        deaths: mainParticipant.deaths,
        kills: mainParticipant.kills,
        runes: { primaryRune: primaryRune, subRune: subRune },
        placement: mainParticipant.placement,
        playerAugments: augments,
        playerSubTeamId: mainParticipant.playerSubteamId,
        position: mainParticipant.teamPosition,
        riotIdGameName: mainParticipant.riotIdGameName,
        riotIdTagline: mainParticipant.riotIdTagline,
        summonerSpell1: summonerSpell1,
        summonerSpell2: summonerSpell2,
        summonerName: mainParticipant.summonerName,
        teamId: mainParticipant.teamId,
        totalMinionsKilled:
          mainParticipant.totalEnemyJungleMinionsKilled +
          mainParticipant.totalMinionsKilled +
          mainParticipant.neutralMinionsKilled,
        visionScore: mainParticipant.visionScore,
      },
      items: items,
      win: mainParticipant.win,
    };
  }

  private static extractOtherParticipants(
    participants: ParticipantDto[],
    puuid: string,
  ): BasicParticipantDto[] {
    const otherParticipants: BasicParticipantDto[] = [];

    participants.forEach((participant) => {
      if (participant.puuid !== puuid) {
        otherParticipants.push({
          assists: participant.assists,
          championId: participant.championId,
          championName: participant.championName,
          champLevel: participant.champLevel,
          deaths: participant.deaths,
          kills: participant.kills,
          placement: participant.placement,
          playerSubTeamId: participant.playerSubteamId,
          position: participant.teamPosition,
          riotIdGameName: participant.riotIdGameName,
          riotIdTagline: participant.riotIdTagline,
          summonerName: participant.summonerName,
          teamId: participant.teamId,
        });
      }
    });

    return otherParticipants;
  }

  private static extractTeamsKDA(participants: ParticipantDto[]): {
    blueTeamKDA: TeamKDA;
    redTeamKDA: TeamKDA;
  } {
    const blueTeamKDA: TeamKDA = {
      kills: 0,
      deaths: 0,
      assists: 0,
    };

    const redTeamKDA: TeamKDA = {
      kills: 0,
      deaths: 0,
      assists: 0,
    };

    participants.forEach((participant) => {
      if (participant.teamId === 100) {
        blueTeamKDA.kills += participant.kills;
        blueTeamKDA.deaths += participant.deaths;
        blueTeamKDA.assists += participant.assists;
      } else {
        redTeamKDA.kills += participant.kills;
        redTeamKDA.deaths += participant.deaths;
        redTeamKDA.assists += participant.assists;
      }
    });

    return { blueTeamKDA, redTeamKDA };
  }
}
