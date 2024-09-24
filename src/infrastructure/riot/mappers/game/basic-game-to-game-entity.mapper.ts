import { BasicGameDto } from 'src/games/dto/basic-game/basic-game.dto';
import { GameEntity } from 'src/games/entities/game.entity';

export class BasicGameToGameEntityMapper {
  public static map(game: BasicGameDto): GameEntity {
    return GameEntity.create({
      match_id: game.matchId,
      puuid: game.puuid,
      server: game.server,
      game_date: game.gameDate,
      game_duration_time: game.gameDurationTime,
      game_mode: game.gameMode,
      game_type: game.gameType,
      main_basic_participant: game.mainBasicParticipant,
      other_basic_participants: game.otherBasicParticipants,
      main_participant_items: game.mainParticipantItems,
      blue_team_kda: game.blueTeamKDA,
      red_team_kda: game.redTeamKDA,
      win: game.win,
    });
  }
}
