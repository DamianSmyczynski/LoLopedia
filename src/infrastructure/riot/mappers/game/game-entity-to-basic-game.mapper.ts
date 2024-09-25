import { BasicGameDto } from 'src/games/dto/basic-game/basic-game.dto';
import { GameEntity } from 'src/games/entities/game.entity';

export class GameEntityToBasicGameMapper {
  public static map(game: GameEntity): BasicGameDto {
    return {
      matchId: game.match_id,
      language: game.language,
      puuid: game.puuid,
      server: game.server,
      gameDate: game.game_date,
      gameDurationTime: game.game_duration_time,
      gameMode: game.game_mode,
      gameType: game.game_type,
      mainBasicParticipant: game.main_basic_participant,
      otherBasicParticipants: game.other_basic_participants,
      mainParticipantItems: game.main_participant_items,
      blueTeamKDA: game.blue_team_kda,
      redTeamKDA: game.red_team_kda,
      win: game.win,
    };
  }
}
