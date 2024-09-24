import { Inject, Injectable } from '@nestjs/common';
import { DetailedGameDto } from '../../../../games/dto/detailed-game/detailed-game.dto';
import { DetailedParticipantDto } from '../../../../games/dto/detailed-game/detailed-participant.dto';
import { DetailedTeamDto } from '../../../../games/dto/detailed-game/detailed-team.dto';
import { GameDto } from '../../../../games/dto/riot-http-game/game.dto';
import { ParticipantDto } from '../../../../games/dto/riot-http-game/participant.dto';
import { AppSymbol } from '../../../../app.symbol';
import { RiotAugmentRepositoryInterface } from '../../interfaces/riot-augment-repository.interface';
import { RiotRuneRepositoryInterface } from '../../interfaces/riot-Rune-repository.interface';
import { RiotChampionRepositoryInterface } from '../../interfaces/riot-champion-repository.interface';
import { RiotSummonerSpellRepositoryInterface } from '../../interfaces/riot-summoner-spell-repository.interface';
import { queueTypes } from '../../../../queue-type';
import { GameTimelineDto } from '../../../../games/dto/timeline/game-timeline.dto';
import { SummonerSpellDto } from '../../../../summoner-spells/summoner-spell.dto';
import { RuneDto } from '../../../../runes/rune.dto';
import { GameToGameTimelineMapper } from './game-to-game-timeline.mapper';
import { RiotItemRepositoryInterface } from '../../interfaces/riot-item-repository.interface';
import { BasicItemDto, ItemDto } from '../../../../items/item.dto';
import { AugmentDto } from 'src/augments/augment.dto';
import { ItemDtoToBasicItemDtoMapper } from '../item/item-dto-to-basic-item-dto.mapper';

@Injectable()
export class GameToDetailedGameMapper {
  constructor(
    @Inject(AppSymbol.RiotAugmentRepository)
    private readonly augmentService: RiotAugmentRepositoryInterface,
    @Inject(AppSymbol.RiotChampionRepository)
    private readonly championService: RiotChampionRepositoryInterface,
    @Inject(AppSymbol.RiotItemRepository)
    private readonly itemService: RiotItemRepositoryInterface,
    @Inject(AppSymbol.RiotRuneRepository)
    private readonly runeService: RiotRuneRepositoryInterface,
    @Inject(AppSymbol.RiotSummonerSpellRepository)
    private readonly summonerSpellService: RiotSummonerSpellRepositoryInterface,
  ) {}
  public async map(
    language: string,
    game: GameDto,
    gameTimeline: GameTimelineDto,
  ): Promise<DetailedGameDto> {
    const [blueTeam, redTeam] = await Promise.all([
      this.getTeamInfo(language, game, 100, gameTimeline),
      this.getTeamInfo(language, game, 200, gameTimeline),
    ]);

    return {
      matchId: game.metadata.matchId,
      gameDate: new Date(game.info.gameStartTimestamp),
      gameDurationTime: game.info.gameEndTimestamp
        ? game.info.gameDuration
        : game.info.gameDuration / 1000,
      gameMode: game.info.gameMode,
      gameType: GameToDetailedGameMapper.extractGameTypeByQueueId(
        game.info.queueId,
      ),
      blueTeam: blueTeam,
      redTeam: redTeam,
      win: GameToDetailedGameMapper.checkWhoWon(blueTeam.participants[0]),
    };
  }

  private static checkWhoWon(participant: DetailedParticipantDto): string {
    if (participant.win) {
      return 'blue';
    } else {
      return 'red';
    }
  }

  private static extractGameTypeByQueueId(queueId: number): string {
    return queueTypes.find((type) => type.id === queueId).name;
  }

  private async getTeamInfo(
    language: string,
    game: GameDto,
    teamId: number,
    gameTimeline: GameTimelineDto,
  ): Promise<DetailedTeamDto> {
    const objectives = game.info.teams.find(
      (team) => team.teamId === teamId,
    ).objectives;

    const bans = game.info.teams.find((team) => team.teamId === teamId).bans;

    const participants: DetailedParticipantDto[] = [];

    for (const participant of game.info.participants) {
      const champion = await this.championService.getChampionDetailsById(
        language,
        participant.championId.toString(),
      );

      const augments = await this.getAugmentsInfo(language, participant);

      const items = await this.getItemsInfo(language, participant);

      const { primaryRunes, subRunes } = await this.getRunesInfo(
        language,
        participant,
      );

      const [summonerSpell1, summonerSpell2] = await this.getSummonerSpellsInfo(
        language,
        participant,
      );

      const timeline = GameToGameTimelineMapper.map(gameTimeline);

      if (participant.teamId === teamId) {
        participants.push({
          augments: augments,
          assists: participant.assists,
          championId: champion.id,
          championName: champion.name,
          champLevel: participant.champLevel,
          deaths: participant.deaths,
          detectorWardsPlaced: participant.detectorWardsPlaced,
          goldEarned: participant.goldEarned,
          items: items,
          itemsTimeline:
            timeline.participantsTimelines[participant.participantId]
              .itemsTimeline,
          KDA: (participant.kills + participant.assists) / participant.deaths,
          kills: participant.kills,
          killsAchievment:
            GameToDetailedGameMapper.specifyAchievment(participant),
          magicDamageDealtToChampions: participant.magicDamageDealtToChampions,
          magicDamageTaken: participant.magicDamageTaken,
          physicalDamageDealtToChampions:
            participant.physicalDamageDealtToChampions,
          physicalDamageTaken: participant.physicalDamageTaken,

          runes: { primaryRunes: primaryRunes, subRunes: subRunes },
          placement: participant.placement,
          playerSubTeamId: participant.playerSubteamId,
          position: participant.teamPosition,
          riotIdGameName: participant.riotIdGameName,
          riotIdTagline: participant.riotIdTagline,
          skillsTimeline:
            timeline.participantsTimelines[participant.participantId]
              .skillsTimeline,
          summonerSpell1: summonerSpell1,
          summonerSpell2: summonerSpell2,
          summonerName: participant.summonerName,
          teamId: participant.teamId,
          totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
          totalDamageTaken: participant.totalDamageTaken,
          totalMinionsKilled:
            participant.totalEnemyJungleMinionsKilled +
            participant.totalMinionsKilled +
            participant.neutralMinionsKilled,
          trueDamageDealtToChampions: participant.trueDamageDealtToChampions,
          trueDamageTaken: participant.trueDamageTaken,
          visionScore: participant.visionScore,
          wardsKilled: participant.wardsKilled,
          wardsPlaced: participant.wardsPlaced,
          win: participant.win,
        });
      }
    }

    return { participants: participants, objectives: objectives, bans: bans };
  }

  private async getAugmentsInfo(
    language: string,
    participant: ParticipantDto,
  ): Promise<AugmentDto[]> {
    const augments = await Promise.all([
      this.augmentService.getDetailsById(
        language,
        participant.playerAugment1.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        participant.playerAugment2.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        participant.playerAugment3.toString(),
      ),
      this.augmentService.getDetailsById(
        language,
        participant.playerAugment4.toString(),
      ),
    ]);

    return augments;
  }

  private async getItemsInfo(
    language: string,
    participant: ParticipantDto,
  ): Promise<BasicItemDto[]> {
    const items = (
      await Promise.all([
        this.itemService.getItemDetails(language, participant.item0.toString()),
        this.itemService.getItemDetails(language, participant.item1.toString()),
        this.itemService.getItemDetails(language, participant.item2.toString()),
        this.itemService.getItemDetails(language, participant.item3.toString()),
        this.itemService.getItemDetails(language, participant.item4.toString()),
        this.itemService.getItemDetails(language, participant.item5.toString()),
        this.itemService.getItemDetails(language, participant.item6.toString()),
      ])
    ).map((item) => {
      if (item) {
        return ItemDtoToBasicItemDtoMapper.map(item);
      }
    });

    return items;
  }

  private async getRunesInfo(
    language: string,
    participant: ParticipantDto,
  ): Promise<{ primaryRunes: RuneDto[]; subRunes: RuneDto[] }> {
    const primaryPerks = participant.perks.styles[0].selections;
    const primaryRunes = await Promise.all([
      this.runeService.getDetailsById(
        language,
        participant.perks.styles[0].style.toString(),
      ),
      this.runeService.getDetailsById(
        language,
        primaryPerks[0].perk.toString(),
      ),
      this.runeService.getDetailsById(
        language,
        primaryPerks[1].perk.toString(),
      ),
      this.runeService.getDetailsById(
        language,
        primaryPerks[2].perk.toString(),
      ),
      this.runeService.getDetailsById(
        language,
        primaryPerks[3].perk.toString(),
      ),
    ]);

    const subPerks = participant.perks.styles[1].selections;
    const subRunes = await Promise.all([
      this.runeService.getDetailsById(
        language,
        participant.perks.styles[1].style.toString(),
      ),
      this.runeService.getDetailsById(language, subPerks[0].perk.toString()),
      this.runeService.getDetailsById(language, subPerks[1].perk.toString()),
    ]);

    return { primaryRunes, subRunes };
  }
  private async getSummonerSpellsInfo(
    language: string,
    participant: ParticipantDto,
  ): Promise<
    [summonerSpell1: SummonerSpellDto, summonerSpell2: SummonerSpellDto]
  > {
    const [summonerSpell1, summonerSpell2] = await Promise.all([
      this.summonerSpellService.getDetailsById(
        language,
        participant.summoner1Id.toString(),
      ),
      this.summonerSpellService.getDetailsById(
        language,
        participant.summoner2Id.toString(),
      ),
    ]);

    return [summonerSpell1, summonerSpell2];
  }

  private static specifyAchievment(participant: ParticipantDto): string {
    let achievment = null;

    if (participant.doubleKills) achievment = 'Double Kill';
    if (participant.tripleKills) achievment = 'Triple Kill';
    if (participant.quadraKills) achievment = 'Quadra Kill';
    if (participant.pentaKills) achievment = 'Penta Kill';

    return achievment;
  }
}
