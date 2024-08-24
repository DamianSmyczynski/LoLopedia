import { BasicGameDto, TeamKDA } from 'src/games/dto/basic-game.dto';
import { GameDto } from 'src/games/dto/game.dto';
import { ParticipantDto } from 'src/games/dto/participant.dto';
import { BasicParticipantDto } from '../../../games/dto/basic-participant.dto';
import { MainParticipantDto } from 'src/games/dto/main-participant.dto';
import { queueTypes } from 'src/queue-type';

export class GameToBasicGameDetailsMapper {
  public static map(
    region: string,
    game: GameDto,
    puuid: string,
    summonerSpellsIds: { id: string; key: string }[],
  ): BasicGameDto {
    const { mainParticipantData, items, win } =
      this.extractMainParticipantsData(game.info.participants, puuid);

    const { blueTeamKDA, redTeamKDA } = this.extractTeamsKDA(
      game.info.participants,
    );

    mainParticipantData.summoner1Id = this.findSummonerSpellIdByKey(
      mainParticipantData.summoner1Id,
      summonerSpellsIds,
    );

    mainParticipantData.summoner2Id = this.findSummonerSpellIdByKey(
      mainParticipantData.summoner2Id,
      summonerSpellsIds,
    );
    return {
      server: region,
      gameDate: new Date(game.info.gameStartTimestamp),
      gameMode: game.info.gameMode,
      gameType: this.extractGameTypeByQueueId(game.info.queueId),
      mainBasicParticipant: mainParticipantData,
      otherBasicParticipants: this.extractOtherParticipants(
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

  private static extractMainParticipantsData(
    participants: ParticipantDto[],
    puuid: string,
  ): {
    mainParticipantData: MainParticipantDto;
    items: number[];
    win: boolean;
  } {
    const mainParticipant = participants.find(
      (participant) => participant.puuid === puuid,
    );

    return {
      mainParticipantData: {
        assists: mainParticipant.assists,
        championId: mainParticipant.championId,
        championName: mainParticipant.championName,
        champLevel: mainParticipant.champLevel,
        deaths: mainParticipant.deaths,
        kills: mainParticipant.kills,
        perks: mainParticipant.perks,
        position: mainParticipant.teamPosition,
        riotIdGameName: mainParticipant.riotIdGameName,
        riotIdTagline: mainParticipant.riotIdTagline,
        summoner1Id: mainParticipant.summoner1Id.toString(),
        summoner2Id: mainParticipant.summoner2Id.toString(),
        summonerName: mainParticipant.summonerName,
        teamId: mainParticipant.teamId,
        totalMinionsKilled:
          mainParticipant.totalEnemyJungleMinionsKilled +
          mainParticipant.totalMinionsKilled +
          mainParticipant.neutralMinionsKilled,
        visionScore: mainParticipant.visionScore,
      },
      items: [
        mainParticipant.item0,
        mainParticipant.item1,
        mainParticipant.item2,
        mainParticipant.item3,
        mainParticipant.item4,
        mainParticipant.item5,
        mainParticipant.item6,
      ],
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

  private static findSummonerSpellIdByKey(
    summonerSpellKey: string,
    summonerSpellsIds: { id: string; key: string }[],
  ) {
    return summonerSpellsIds.find(
      (summonerSpell) => summonerSpell.key === summonerSpellKey,
    ).id;
  }
}
